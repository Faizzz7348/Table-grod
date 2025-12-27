# Duplicate Validation Feature

## 🎯 Overview
Sistem validation untuk mencegah duplicate values dalam editable cells, terutamanya untuk field yang memerlukan unique values seperti 'code' dan 'route'.

## ✨ Features

### 1. Real-time Duplicate Detection
- Validation berlaku semasa user sedang menaip
- Visual feedback segera dengan border merah dan warning icon
- Tidak perlu tunggu submit/save untuk tahu ada duplicate

### 2. Visual Indicators
- 🔴 **Red Border** - Input field bertukar merah bila detect duplicate
- ⚠️ **Warning Icon** - Icon triangle dengan exclamation mark muncul
- 💥 **Shake Animation** - Input bergetar bila ada duplicate
- 🎨 **Row Highlight** - Entire row akan di-highlight dengan background merah muda

### 3. Prevent Save
- System akan block save operation bila ada duplicate
- Toast notification muncul dengan error message
- User kena tukar value dulu sebelum boleh save

## 🛠️ Implementation Details

### EditableCell Component
```jsx
<EditableCell 
  value={currentValue}
  onSave={handleSave}
  editMode={true}
  allValues={allDataArray}
  fieldName="code"
  currentRowId={rowId}
/>
```

**Props:**
- `value` - Current cell value
- `onSave` - Callback function when save
- `editMode` - Enable/disable editing
- `allValues` - Array of all data untuk check duplicate
- `fieldName` - Field name yang nak check (e.g., 'code', 'route')
- `currentRowId` - Current row ID untuk exclude dari duplicate check

### FlexibleScrollDemo Integration

#### 1. Code Field Validation (Dialog Table)
```javascript
const onDialogCellEditComplete = (e) => {
    let { rowData, newValue, field } = e;
    
    if (field === 'code' && newValue !== rowData[field]) {
        const isDuplicate = dialogData.some(item => 
            item.code === newValue && item.id !== rowData.id
        );
        
        if (isDuplicate) {
            toast.current.show({
                severity: 'error',
                summary: 'Duplicate Code',
                detail: `Code "${newValue}" already exists!`,
                life: 3000
            });
            return; // Block save
        }
    }
    
    handleUpdateDialogData(rowData.id, field, newValue);
};
```

#### 2. Route Field Validation (Main Table)
```javascript
const onCellEditComplete = (e) => {
    let { rowData, newValue, field } = e;
    
    if (field === 'route' && newValue !== rowData[field]) {
        const isDuplicate = routes.some(item => 
            item.route === newValue && item.id !== rowData.id
        );
        
        if (isDuplicate) {
            toast.current.show({
                severity: 'error',
                summary: 'Duplicate Route',
                detail: `Route "${newValue}" already exists!`,
                life: 3000
            });
            return;
        }
    }
    
    handleUpdateRow(rowData.id, field, newValue);
};
```

#### 3. Custom Text Editor dengan Real-time Detection
```javascript
const textEditor = (options) => {
    const { rowData, field } = options;
    const [localValue, setLocalValue] = useState(options.value);
    const [isDuplicate, setIsDuplicate] = useState(false);

    useEffect(() => {
        if (field === 'code') {
            const duplicate = dialogData.some(item => 
                item.code === localValue && item.id !== rowData.id
            );
            setIsDuplicate(duplicate);
        }
    }, [localValue]);

    return (
        <div style={{ position: 'relative' }}>
            <InputText 
                value={localValue} 
                onChange={(e) => {
                    setLocalValue(e.target.value);
                    options.editorCallback(e.target.value);
                }}
                className={isDuplicate ? 'p-invalid' : ''}
            />
            {isDuplicate && (
                <i className="pi pi-exclamation-triangle" />
            )}
        </div>
    );
};
```

## 🎨 CSS Styling

### Animations
```css
/* Shake animation for invalid input */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Pulse animation for warning icon */
@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.1);
  }
}
```

### Visual States
```css
/* Invalid input styling */
.p-inputtext.p-invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25) !important;
  animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

/* Row highlight when has invalid input */
.p-datatable .p-datatable-tbody > tr:has(.p-invalid) {
  background-color: rgba(239, 68, 68, 0.03) !important;
  border-left: 3px solid #ef4444 !important;
}
```

## 📋 Usage Examples

### Example 1: Basic Duplicate Check
```javascript
// User cuba edit code dari "ABC" ke "XYZ"
// System check: ada row lain dengan code "XYZ"?
// Jika ada -> show error, block save
// Jika tidak -> allow save
```

### Example 2: Multiple Fields Validation
```javascript
// Check multiple fields untuk duplicates
const validateFields = (data, field, value, currentId) => {
    const fieldsToValidate = ['code', 'route', 'sku'];
    
    if (fieldsToValidate.includes(field)) {
        return data.some(item => 
            item[field] === value && item.id !== currentId
        );
    }
    return false;
};
```

## 🚀 Benefits

1. **Better Data Integrity** - Pastikan data unique dan consistent
2. **User Experience** - Immediate feedback, user tak perlu guess
3. **Prevent Errors** - Catch duplicates sebelum data masuk database
4. **Visual Feedback** - Clear indication apa masalah dan di mana
5. **Professional Look** - Smooth animations dan polished UI

## 🔧 Customization

### Change Validation Fields
Untuk add validation pada field lain, update condition dalam `onCellEditComplete`:

```javascript
// Add validation untuk field 'sku'
if (field === 'sku' && newValue !== rowData[field]) {
    const isDuplicate = products.some(item => 
        item.sku === newValue && item.id !== rowData.id
    );
    // ... rest of validation
}
```

### Customize Error Messages
```javascript
toast.current.show({
    severity: 'error',
    summary: 'Custom Title',
    detail: `Custom message: ${newValue}`,
    life: 4000 // Display duration in ms
});
```

### Change Animation
Update CSS untuk guna animation lain:
```css
.p-inputtext.p-invalid {
  animation: bounce 0.5s ease-in-out; /* Ganti dengan animation lain */
}
```

## 📝 Notes

- Validation hanya aktif dalam **Edit Mode**
- Case-sensitive comparison (boleh modify untuk case-insensitive)
- Validation berlaku pada client-side (server-side validation still recommended)
- Compatible dengan dark mode
- Accessible dengan screen readers (aria-invalid attribute)

## 🐛 Troubleshooting

### Issue: Validation tidak berfungsi
- ✅ Check Edit Mode is ON
- ✅ Pastikan field name betul dalam validation
- ✅ Check Toast component ada dalam render tree

### Issue: False positive duplicate
- ✅ Verify currentRowId passed correctly
- ✅ Check comparison logic (===)
- ✅ Ensure data array updated correctly

### Issue: Animation tidak smooth
- ✅ Check browser support untuk CSS animations
- ✅ Verify CSS transitions loaded properly
- ✅ Check for conflicting styles
