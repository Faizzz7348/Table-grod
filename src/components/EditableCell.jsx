import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';

export function EditableCell({ value, onSave, editMode, allValues = [], fieldName = '', currentRowId = null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState('');

  const checkDuplicate = (newValue) => {
    if (!fieldName || !allValues || allValues.length === 0) return false;
    
    // Check if value already exists in other rows
    const isDuplicate = allValues.some(item => 
      item[fieldName] === newValue && item.id !== currentRowId
    );
    
    return isDuplicate;
  };

  const handleSave = () => {
    // Check for duplicates
    if (checkDuplicate(editValue)) {
      setError('Duplicate value not allowed!');
      return;
    }
    
    if (editValue !== value) {
      onSave(editValue);
    }
    setError('');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (editMode && !isEditing) {
      setIsEditing(true);
    }
  };

  // When editing, show input
  if (isEditing && editMode) {
    const isDuplicate = checkDuplicate(editValue);
    
    return (
      <div style={{ width: '100%', padding: '0.25rem', position: 'relative' }}>
        <InputText
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            setError('');
          }}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSave();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              handleCancel();
            }
          }}
          autoFocus
          className={isDuplicate ? 'p-invalid' : ''}
          style={{ 
            width: '100%', 
            padding: '0.5rem',
            fontSize: '0.875rem',
            textAlign: 'center',
            border: isDuplicate ? '2px solid #ef4444' : '2px solid #3b82f6',
            borderRadius: '8px',
            backgroundColor: isDuplicate ? 'rgba(239, 68, 68, 0.05)' : 'white'
          }}
        />
        {isDuplicate && (
          <small style={{ 
            color: '#ef4444', 
            fontSize: '0.75rem',
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '2px',
            whiteSpace: 'nowrap',
            fontWeight: 'bold'
          }}>
            ⚠️ Duplicate not allowed
          </small>
        )}
        {error && (
          <small style={{ 
            color: '#ef4444', 
            fontSize: '0.75rem',
            display: 'block',
            marginTop: '0.25rem',
            textAlign: 'center'
          }}>
            {error}
          </small>
        )}
      </div>
    );
  }

  // Normal display
  return (
    <div
      onClick={handleClick}
      style={{
        cursor: editMode ? 'pointer' : 'default',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        transition: 'all 0.2s ease',
        minWidth: '80px',
        width: '100%',
        display: 'inline-block',
        backgroundColor: editMode ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
        border: editMode ? '2px dashed rgba(59, 130, 246, 0.3)' : 'none',
        fontWeight: '500'
      }}
      onMouseEnter={(e) => {
        if (editMode) {
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
          e.currentTarget.style.borderStyle = 'solid';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
      onMouseLeave={(e) => {
        if (editMode) {
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
          e.currentTarget.style.borderStyle = 'dashed';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
      title={editMode ? '✏️ Click to edit' : ''}
    >
      {value || '—'}
    </div>
  );
}
