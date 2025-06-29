import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { FaBold, FaItalic, FaUnderline, FaPalette, FaImage, FaTimes, FaTextHeight, FaFont } from 'react-icons/fa';

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
  stopEditing,
  fontSizePickerVisible,
  setFontSizePickerVisible,
  fontPickerVisible,
  setFontPickerVisible,
  tempFontSize,
  setTempFontSize,
  tempFontFamily,
  setTempFontFamily
}) => {
  if (!showToolbar || !editingBlock) return null;

  // 안전한 기본값 설정
  const safeEditingBlock = editingBlock || '';
  const fieldName = safeEditingBlock.includes('-') ? safeEditingBlock.split('-')[1] : '';
  const safeTempFontSize = tempFontSize || 16;
  const safeTempFontFamily = tempFontFamily || 'Arial, sans-serif';

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
          onClick={() => fieldName && applyTextFormat(currentPage, fieldName, 'bold')}
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
          onClick={() => fieldName && applyTextFormat(currentPage, fieldName, 'italic')}
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
          onClick={() => fieldName && applyTextFormat(currentPage, fieldName, 'underline')}
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
          onClick={() => {
            setFontSizePickerVisible && setFontSizePickerVisible(!fontSizePickerVisible);
          }}
          style={{
            padding: '8px',
            backgroundColor: fontSizePickerVisible ? '#333' : 'transparent',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <FaTextHeight />
        </button>
        <button
          onClick={() => {
            setFontPickerVisible && setFontPickerVisible(!fontPickerVisible);
          }}
          style={{
            padding: '8px',
            backgroundColor: fontPickerVisible ? '#333' : 'transparent',
            color: 'white',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <FaFont />
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
                if (fieldName) {
                  applyTextFormat(currentPage, fieldName, 'color');
                  setColorPickerVisible(false);
                }
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

      {/* 폰트 크기 선택기 */}
      {fontSizePickerVisible && (
        <div style={{
          position: 'fixed',
          left: toolbarPosition.x,
          top: toolbarPosition.y + 60,
          zIndex: 1002,
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          minWidth: '200px'
        }}>
          <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
            폰트 크기 선택
          </div>
          <input
            type="range"
            min="10"
            max="48"
            value={safeTempFontSize}
            onChange={(e) => setTempFontSize && setTempFontSize(e.target.value)}
            style={{
              width: '100%',
              marginBottom: '10px'
            }}
          />
          <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '12px', color: '#666' }}>
            {safeTempFontSize}px
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          {[12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48].map(size => (
                <button
                  key={size}
                  onClick={() => setTempFontSize && setTempFontSize(size)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: safeTempFontSize == size ? '#059669' : '#f0f0f0',
                    color: safeTempFontSize == size ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {size}px
                </button>
              ))}
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => {
                if (fieldName) {
                  applyTextFormat(currentPage, fieldName, 'fontSize');
                  setFontSizePickerVisible(false);
                }
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
              onClick={() => setFontSizePickerVisible(false)}
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

      {/* 폰트 패밀리 선택기 */}
      {fontPickerVisible && (
        <div style={{
          position: 'fixed',
          left: toolbarPosition.x,
          top: toolbarPosition.y + 60,
          zIndex: 1002,
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          minWidth: '250px'
        }}>
          <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
            폰트 선택
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
            {[
              { name: 'Arial', value: 'Arial, sans-serif' },
              { name: 'Times New Roman', value: 'Times New Roman, serif' },
              { name: 'Helvetica', value: 'Helvetica, sans-serif' },
              { name: 'Myriad Pro', value: 'Myriad Pro, sans-serif' },
              { name: 'Georgia', value: 'Georgia, serif' },
              { name: 'Verdana', value: 'Verdana, sans-serif' },
              { name: 'Courier New', value: 'Courier New, monospace' },
              { name: '맑은 고딕', value: 'Malgun Gothic, sans-serif' },
              { name: '나눔고딕', value: 'Nanum Gothic, sans-serif' },
              { name: '돋움', value: 'Dotum, sans-serif' },

            ].map(font => (
                              <button
                  key={font.value}
                  onClick={() => setTempFontFamily && setTempFontFamily(font.value)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: safeTempFontFamily === font.value ? '#059669' : '#f8f8f8',
                    color: safeTempFontFamily === font.value ? 'white' : '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: font.value,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (safeTempFontFamily !== font.value) {
                      e.target.style.backgroundColor = '#e8e8e8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (safeTempFontFamily !== font.value) {
                      e.target.style.backgroundColor = '#f8f8f8';
                    }
                  }}
              >
                {font.name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => {
                if (fieldName) {
                  applyTextFormat(currentPage, fieldName, 'fontFamily');
                  setFontPickerVisible(false);
                }
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
              onClick={() => setFontPickerVisible(false)}
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