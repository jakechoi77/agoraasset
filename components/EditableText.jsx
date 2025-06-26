import React from 'react';

const EditableText = ({ 
  content, 
  field, 
  sectionId, 
  isTitle = false, 
  isMainTitle = false,
  isEditMode,
  editingBlock,
  startEditing,
  updateContent
}) => {
  const isEditing = editingBlock === `${sectionId}-${field}`;
  
  if (isEditing) {
    // HTML 태그를 제거하고 순수 텍스트만 표시
    const tempDiv = document.createElement('div');
    tempDiv.textContent = content; // innerHTML 대신 textContent 사용
    const plainText = tempDiv.textContent || '';
    
    return (
      <div style={{ position: 'relative' }}>
        <textarea
          value={plainText}
          onChange={(e) => updateContent(sectionId, field, e.target.value)}
          style={{
            width: '100%',
            minHeight: isTitle ? '60px' : isMainTitle ? '80px' : '120px',
            padding: '10px',
            border: '2px solid #8B1538',
            borderRadius: '8px',
            fontSize: isTitle ? '3rem' : isMainTitle ? '1.4rem' : '1rem',
            fontWeight: isTitle ? 'bold' : isMainTitle ? 'bold' : 'normal',
            fontStyle: isTitle ? 'italic' : 'normal',
            color: isTitle ? '#fff' : isMainTitle ? '#8B1538' : '#333',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            resize: 'vertical',
            outline: 'none'
          }}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      onClick={(e) => isEditMode && startEditing(`${sectionId}-${field}`, e)}
      style={{
        cursor: isEditMode ? 'pointer' : 'default',
        border: isEditMode ? '2px dashed rgba(139, 21, 56, 0.3)' : 'none',
        padding: isEditMode ? '5px' : '0',
        borderRadius: '4px',
        transition: 'all 0.3s ease'
      }}
    >
      {isTitle ? (
        <h1 
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#fff',
            fontStyle: 'italic',
            margin: 0,
            textTransform: 'lowercase'
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : isMainTitle ? (
        <h2 
          style={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: '#8B1538',
            margin: '0 0 1rem 0',
            lineHeight: '1.4',
            letterSpacing: '0.5px'
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div 
          style={{
            fontSize: '1rem',
            color: '#333',
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default EditableText; 