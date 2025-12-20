import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';

export function EditableCell({ value, onSave, editMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
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
    return (
      <div style={{ width: '100%', padding: '0.25rem' }}>
        <InputText
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
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
          style={{ 
            width: '100%', 
            padding: '0.5rem',
            fontSize: '0.875rem',
            textAlign: 'center',
            border: '2px solid #3b82f6',
            borderRadius: '8px'
          }}
        />
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
