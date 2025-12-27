# 💾 Save Order Preset Feature

## Overview
Feature untuk save custom sort order sebagai preset yang boleh digunakan semula. Data disimpan secara individual dalam localStorage (tidak shared dengan user lain).

## Features

### 1. Save Custom Sort Order
- Button **"Save Preset"** muncul di sebelah button **"Close"** apabila dalam custom sort mode
- User perlu set order numbers dahulu sebelum boleh save
- Akan popup dialog untuk input nama preset
- Data disimpan dalam localStorage dengan maklumat:
  - Preset name
  - Route ID & name (untuk validation)
  - Sort orders mapping
  - Created timestamp

### 2. View Saved Presets List
- Accessible melalui **"Function"** dropdown > **"View Saved Presets"**
- Menunjukkan:
  - Nama preset
  - Route yang berkaitan
  - Bilangan items yang di-sort
  - Action buttons (Apply & Delete)
- Empty state bila tiada preset tersimpan

### 3. Apply Saved Preset
- Click button **✓ (Apply)** pada preset list
- Validate preset adalah untuk route yang betul
- Load sort orders ke dalam custom sort mode
- User masih perlu click **"Apply"** dalam Set Order mode untuk apply sorting ke table

### 4. Delete Preset
- Click button **🗑️ (Delete)** pada preset list
- Confirmation dialog sebelum delete
- Remove dari localStorage

## How to Use

### Cara Save Preset:
1. Buka dialog route (click Edit button pada route)
2. Click **"Function"** > **"Set Order"**
3. Enter nombor untuk sort order
4. Click **"Save Preset"** (sebelah button Close)
5. Enter preset name
6. Click **"Save"**

### Cara Apply Preset:
1. Buka dialog route yang sama
2. Click **"Function"** > **"View Saved Presets"**
3. Cari preset yang dikehendaki
4. Click **✓ (Apply)** button
5. Preset akan load ke custom sort mode
6. Click **"Apply"** untuk apply sorting ke table

## Technical Details

### State Management
```javascript
const [savePresetDialogVisible, setSavePresetDialogVisible] = useState(false);
const [presetName, setPresetName] = useState('');
const [savedPresets, setSavedPresets] = useState([]);
const [presetsListVisible, setPresetsListVisible] = useState(false);
```

### LocalStorage Structure
```javascript
{
  id: timestamp,
  name: "Preset Name",
  routeId: 123,
  routeName: "KL01",
  sortOrders: { 1: 1, 2: 3, 5: 2 },
  createdAt: "2025-12-27T..."
}
```

### Key Functions
- `handleSavePreset()` - Save current sort orders as preset
- `handleApplyPreset(preset)` - Load preset into custom sort mode
- `handleDeletePreset(presetId)` - Delete preset from storage

## UI Components

### Save Preset Button
- Location: Dialog header, sebelah Close button
- Visible: Hanya dalam custom sort mode
- Disabled: Bila tiada sort orders entered
- Icon: pi-save
- Color: Success (green)

### Presets List Dialog
- Header: Bookmark icon
- Width: 600px (desktop), 95vw (mobile)
- Empty State: Inbox icon with message
- List Item:
  - Preset name (bold)
  - Route info
  - Item count
  - Apply & Delete buttons

## Validation
- ✅ Preset name required (tidak boleh kosong)
- ✅ Sort orders must have values before save
- ✅ Preset hanya boleh apply pada route yang sama
- ✅ Confirmation sebelum delete preset

## Features Coming Soon
- Export/Import presets
- Share presets with other users
- Preset templates for common patterns
- Preset history/versioning

---
**Created:** December 27, 2025
**Version:** 1.0.0
