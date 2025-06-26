import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { FaBold, FaItalic, FaUnderline, FaPalette, FaImage, FaTimes } from 'react-icons/fa';

const EditToolbar = ({
  showToolbar,
  toolbarPosition,
  editingBlock,
  currentPage,
  applyTextFormat,
  colorPickerVisible,
  setColorPickerVisible,
  tempColor,
  setTempColor,
  handleImageUpload,
  stopEditing
}) => {
  if (!showToolbar || !editingBlock) return null;

  return (
    <>
      {/* 편집 툴바 */}
      <div style={{
        position: 'fixed',
        left: toolbarPosition.x,
        top: toolbarPosition.y,
        zIndex: 1001,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '8px',
        padding: '10px',
        display: 'flex',
        gap: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}>
        <button
          onClick={() => applyTextFormat(currentPage, editingBlock.split('-')[1], 'bold')}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <FaBold />
        </button>
        <button
          onClick={() => applyTextFormat(currentPage, editingBlock.split('-')[1], 'italic')}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <FaItalic />
        </button>
        <button
          onClick={() => applyTextFormat(currentPage, editingBlock.split('-')[1], 'underline')}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <FaUnderline />
        </button>
        <button
          onClick={() => setColorPickerVisible(!colorPickerVisible)}
          style={{
            padding: '8px',
            backgroundColor: colorPickerVisible ? '#333' : 'transparent',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <FaPalette />
        </button>
        <button
          onClick={() => document.getElementById(`toolbar-image-upload`).click()}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <FaImage />
        </button>
        <input
          id="toolbar-image-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleImageUpload(currentPage, editingBlock.split('-')[1], e)}
        />
        <button
          onClick={stopEditing}
          style={{
            padding: '8px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
        >
          <FaTimes />
        </button>
      </div>

      {/* 색상 선택기 */}
      {colorPickerVisible && (
        <div style={{
          position: 'fixed',
          left: toolbarPosition.x,
          top: toolbarPosition.y + 60,
          zIndex: 1002,
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}>
          <HexColorPicker color={tempColor} onChange={setTempColor} />
          <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
            <button
              onClick={() => {
                applyTextFormat(currentPage, editingBlock.split('-')[1], 'color');
                setColorPickerVisible(false);
              }}
              style={{
                padding: '5px 10px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              적용
            </button>
            <button
              onClick={() => setColorPickerVisible(false)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditToolbar; 