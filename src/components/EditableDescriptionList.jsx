import { useState, useEffect, memo, useCallback } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export const EditableDescriptionList = memo(function EditableDescriptionList({ value, onSave, isEditable = true }) {
  const [items, setItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse the value string into items array
  useEffect(() => {
    if (!value || value.trim() === '') {
      setItems([]);
      return;
    }

    // Parse format: "term1: definition1\nterm2: definition2"
    const lines = value.split('\n').filter(line => line.trim() !== '');
    const parsedItems = lines.map(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        return {
          term: line.substring(0, colonIndex).trim(),
          definition: line.substring(colonIndex + 1).trim()
        };
      }
      return { term: '', definition: line.trim() };
    });
    setItems(parsedItems);
  }, [value]);

  const handleItemChange = useCallback((index, field, newValue) => {
    const updatedItems = [...items];
    updatedItems[index][field] = newValue;
    setItems(updatedItems);
    
    // Save immediately
    const serialized = updatedItems
      .filter(item => item.term.trim() || item.definition.trim())
      .map(item => `${item.term}: ${item.definition}`)
      .join('\n');
    onSave(serialized);
  }, [items, onSave]);

  const handleAddItem = useCallback(() => {
    setItems([...items, { term: '', definition: '' }]);
  }, [items]);

  const handleRemoveItem = useCallback((index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    
    const serialized = updatedItems
      .filter(item => item.term.trim() || item.definition.trim())
      .map(item => `${item.term}: ${item.definition}`)
      .join('\n');
    onSave(serialized);
  }, [items, onSave]);

  // Display only mode
  if (!isEditable) {
    if (items.length === 0) {
      return (
        <p style={{ fontSize: '10px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '8px' }}>
          No information
        </p>
      );
    }

    const displayValue = value || '';
    const shouldShowToggle = displayValue.length > 100;
    const displayItems = shouldShowToggle && !isExpanded ? items.slice(0, 2) : items;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {shouldShowToggle && (
          <Button
            icon={isExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}
            label={isExpanded ? "Show less" : "Show more"}
            text
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ fontSize: '10px', padding: '4px 8px', alignSelf: 'flex-start' }}
          />
        )}
        <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {displayItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <dt style={{ 
                minWidth: '80px', 
                flexShrink: 0, 
                fontWeight: '600', 
                color: '#3b82f6',
                fontSize: '11px'
              }}>
                {item.term}
              </dt>
              <dd style={{ 
                flex: 1, 
                margin: 0,
                fontSize: '11px',
                color: '#495057'
              }}>
                {item.definition}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  // Edit mode
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <InputText
                value={item.term}
                onChange={(e) => handleItemChange(index, 'term', e.target.value)}
                placeholder="Label"
                style={{ width: '100px', fontSize: '11px' }}
              />
              <InputText
                value={item.definition}
                onChange={(e) => handleItemChange(index, 'definition', e.target.value)}
                placeholder="Value"
                style={{ flex: 1, fontSize: '11px' }}
              />
              <Button
                icon="pi pi-times"
                rounded
                text
                severity="danger"
                size="small"
                onClick={() => handleRemoveItem(index)}
                style={{ width: '28px', height: '28px' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '10px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '8px' }}>
          No information available. Click "Add Item" to add details.
        </p>
      )}
      <Button
        label="Add Item"
        icon="pi pi-plus"
        size="small"
        text
        onClick={handleAddItem}
        style={{ fontSize: '10px', padding: '4px 8px', alignSelf: 'flex-start' }}
      />
    </div>
  );
});
export default EditableDescriptionList;