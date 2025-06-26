import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaBold, FaItalic, FaUnderline, FaPalette, FaPlus, FaTrash, FaEdit, FaImage, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { HexColorPicker } from 'react-colorful';
import EditableText from './components/EditableText';
import EditToolbar from './components/EditToolbar';
import MainPage from './components/MainPage';
import './App.css';

const AgoraWebsite = () => {
  // 간소화된 스타일 적용
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#000';
  }, []);

  // 상태 관리 최적화
  const [currentPage, setCurrentPage] = useState('main');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [tempColor, setTempColor] = useState('#333333');
  const [uploadingImage, setUploadingImage] = useState(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [currentEditingField, setCurrentEditingField] = useState(null);

  // 모든 섹션의 데이터를 통합 관리
  const [sectionData, setSectionData] = useState({
    leadership: {
      title: 'leadership',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg1.jpg?alt=media&token=3cc87cd8-8ff3-461a-a56b-072e33a7455a',
      mainTitle: 'GLOBAL & DYNAMIC INVESTMENT MANAGEMENT',
      mainContent: 'At Agora Asset, we thrive at the intersection of innovation, global vision, and strategic investment acumen. As pioneers in dynamic asset management, our expertise spans robust financial foundation, and cutting-edge strategies have earned us the confidence of the world\'s most sophisticated investors.',
      subContent: 'We passionately build lasting relationships, committed to placing our clients\' ambitions at the heart of every decision, paving the way for sustainable success and mutual growth.',
      footer: 'Leadership Excellence Since 2020',
      personName: 'David C. Kim',
      personTitle: 'Chief Executive Officer',
      personImage: null
    },
    whatwedo: {
      title: 'what we do',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg2.jpg?alt=media&token=8ff3-461a-a56b-072e33a7455a',
      mainTitle: 'COMPREHENSIVE INVESTMENT SOLUTIONS',
      mainContent: 'Our diversified portfolio approach encompasses private equity, real estate development, hedge fund strategies, and innovative technology investments. We leverage cutting-edge analytics and global market insights to deliver superior returns for our clients.',
      subContent: 'From emerging markets to established economies, we identify and capitalize on opportunities that others overlook, creating value through strategic partnerships and disciplined execution.',
      footer: 'Investment Excellence Since 2020',
      personName: 'Sarah M. Chen',
      personTitle: 'Chief Investment Officer',
      personImage: null
    },
    itp: {
      title: 'itp & capital market',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg3.jpg?alt=media&token=9ff3-461a-a56b-072e33a7455a',
      mainTitle: 'INNOVATIVE TECHNOLOGY PARTNERSHIPS',
      mainContent: 'We pioneer the integration of artificial intelligence and blockchain technologies into traditional investment frameworks. Our ITP division focuses on identifying and nurturing disruptive technologies that reshape entire industries.',
      subContent: 'Through strategic capital market operations, we facilitate seamless access to global liquidity while maintaining the highest standards of regulatory compliance and risk management.',
      footer: 'Technology Innovation Since 2020',
      personName: 'Michael R. Thompson',
      personTitle: 'Chief Technology Officer',
      personImage: null
    },
    redevelopment: {
      title: 'r.e. development',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg4.jpg?alt=media&token=aff3-461a-a56b-072e33a7455a',
      mainTitle: 'SUSTAINABLE REAL ESTATE DEVELOPMENT',
      mainContent: 'Our real estate development division creates iconic properties that define urban landscapes. We focus on sustainable development practices, smart city integration, and community-centric design principles.',
      subContent: 'From luxury residential complexes to cutting-edge commercial spaces, we transform visions into reality while maximizing long-term value for investors and communities alike.',
      footer: 'Development Excellence Since 2020',
      personName: 'Jennifer L. Park',
      personTitle: 'Head of Real Estate',
      personImage: null
    },
    announcement: {
      title: 'announcement',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg5.jpg?alt=media&token=bff3-461a-a56b-072e33a7455a',
      mainTitle: 'LATEST NEWS & ANNOUNCEMENTS',
      mainContent: 'Stay informed about our latest developments, strategic partnerships, and market insights. We regularly share updates on our investment activities and industry perspectives.',
      subContent: 'Our commitment to transparency ensures that stakeholders are always informed about significant developments and opportunities within our organization.',
      footer: 'News & Updates 2024',
      personName: 'Robert K. Wilson',
      personTitle: 'Head of Communications',
      personImage: null
    }
  });

  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      title: "AGORA ASSET Expands Global Investment Portfolio",
      date: "2024-12-20",
      content: "We are pleased to announce our strategic expansion into emerging Asian markets, focusing on sustainable development projects and AI-driven investment opportunities."
    },
    {
      id: 2,
      title: "New Partnership with European Financial Institutions", 
      date: "2024-12-15",
      content: "AGORA ASSET has formed strategic alliances with leading European banks to enhance our international finance capabilities and broaden our investment reach."
    },
    {
      id: 3,
      title: "Sustainable Development Initiative Launched",
      date: "2024-12-10",
      content: "Our new sustainability program focuses on ESG-compliant investments and carbon-neutral development projects across multiple sectors."
    }
  ]);

  // 섹션 정보 메모이제이션
  const sections = useMemo(() => [
    { id: 'leadership', title: 'LEADERSHIP' },
    { id: 'whatwedo', title: 'WHAT WE DO' },
    { id: 'itp', title: 'ITP & CAPITAL MARKET' },
    { id: 'redevelopment', title: 'R.E. DEVELOPMENT' },
    { id: 'announcement', title: 'ANNOUNCEMENT' }
  ], []);

  useEffect(() => {
    if (currentPage === 'main') {
      setMenuVisible(true);
      setIsEditMode(false);
      setEditingBlock(null);
    }
  }, [currentPage]);

  // 편집 기능들 - 성능 최적화를 위해 useCallback 사용
  const startEditing = useCallback((blockId, event) => {
    setEditingBlock(blockId);
    if (event) {
      const rect = event.target.getBoundingClientRect();
      setToolbarPosition({
        x: rect.left,
        y: rect.top - 60
      });
      setShowToolbar(true);
    }
  }, []);

  const stopEditing = useCallback(() => {
    setEditingBlock(null);
    setColorPickerVisible(false);
    setShowToolbar(false);
  }, []);

  const updateContent = useCallback((sectionId, field, value) => {
    setSectionData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
  }, []);

  const applyFormatting = (sectionId, field, property, value) => {
    // 실제 편집 시 사용할 포맷팅 함수
    updateContent(sectionId, field, value);
  };

  // 뉴스 관리 함수들 - 성능 최적화
  const addNews = useCallback(() => {
    const newNews = {
      id: Date.now(),
      title: "새로운 공지사항",
      date: new Date().toISOString().split('T')[0],
      content: "새로운 공지사항 내용을 입력하세요."
    };
    setNewsItems(prev => [newNews, ...prev]);
  }, []);

  const updateNews = useCallback((id, field, value) => {
    // 입력값 검증
    if (!id || !field || value === undefined) return;
    
    setNewsItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: String(value).slice(0, 1000) } : item // 최대 1000자 제한
    ));
  }, []);

  const deleteNews = useCallback((id) => {
    if (!id) return;
    setNewsItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // 이미지 업로드 처리 - 보안 및 성능 최적화
  const handleImageUpload = useCallback((sectionId, field, event) => {
    const file = event.target.files?.[0];
    
    // 파일 검증
    if (!file) return;
    
    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('지원되는 이미지 형식: JPEG, PNG, GIF, WebP');
      return;
    }
    
    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const currentContent = sectionData[sectionId]?.[field] || '';
        const safeImageSrc = e.target.result;
        const imageTag = `<br/><img src="${safeImageSrc}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; display: block;" alt="업로드된 이미지" /><br/>`;
        updateContent(sectionId, field, currentContent + imageTag);
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
        alert('이미지 업로드 중 오류가 발생했습니다.');
      }
    };
    
    reader.onerror = () => {
      alert('이미지 읽기 중 오류가 발생했습니다.');
    };
    
    reader.readAsDataURL(file);
  }, [sectionData, updateContent]);

  // 텍스트 서식 적용 - XSS 보안 강화
  const applyTextFormat = useCallback((sectionId, field, format) => {
    const currentContent = sectionData[sectionId][field];
    
    // 안전한 텍스트 추출 함수
    const extractSafeText = (htmlContent) => {
      if (typeof htmlContent !== 'string') return '';
      const tempDiv = document.createElement('div');
      tempDiv.textContent = htmlContent; // innerHTML 대신 textContent 사용
      return tempDiv.textContent || '';
    };
    
    const plainText = extractSafeText(currentContent);
    let newContent = plainText;
    
    // 안전한 HTML 생성
    switch(format) {
      case 'bold':
        newContent = `<strong>${plainText.replace(/[<>]/g, '')}</strong>`;
        break;
      case 'italic':
        newContent = `<em>${plainText.replace(/[<>]/g, '')}</em>`;
        break;
      case 'underline':
        newContent = `<u>${plainText.replace(/[<>]/g, '')}</u>`;
        break;
      case 'color':
        // 색상 값 검증
        const safeColor = /^#[0-9A-Fa-f]{6}$/.test(tempColor) ? tempColor : '#333333';
        newContent = `<span style="color: ${safeColor}">${plainText.replace(/[<>]/g, '')}</span>`;
        break;
      default:
        newContent = plainText;
    }
    
    updateContent(sectionId, field, newContent);
  }, [sectionData, tempColor, updateContent]);

  // MainPage 컴포넌트는 별도 파일로 분리됨

  // 통합 섹션 페이지 컴포넌트
  const SectionPage = ({ sectionId }) => {
    const [titleVisible, setTitleVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const data = sectionData[sectionId];

    useEffect(() => {
      const titleTimer = setTimeout(() => setTitleVisible(true), 300);
      const contentTimer = setTimeout(() => setContentVisible(true), 800);
      return () => {
        clearTimeout(titleTimer);
        clearTimeout(contentTimer);
      };
    }, []);

    // 텍스트 편집 핸들러
    const handleTextEdit = (field, value) => {
      updateContent(sectionId, field, value);
    };

    // 편집 가능한 텍스트 컴포넌트 - 완전한 편집 시스템
    const EditableTextBlock = ({ content, field, isTitle = false, isSubtitle = false, className = "" }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editValue, setEditValue] = useState(content);
      const [showToolbar, setShowToolbar] = useState(false);
      const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
      const [showColorPicker, setShowColorPicker] = useState(false);
      
      // 저장된 스타일 정보를 불러오기
      const savedStyle = data[`${field}_style`];
      const [currentStyle, setCurrentStyle] = useState(savedStyle || {
        bold: isTitle ? true : isSubtitle ? true : false,
        italic: isTitle ? true : false,
        underline: false,
        color: isTitle ? '#ffffff' : isSubtitle ? '#8B1538' : '#333333',
        fontSize: isTitle ? '3rem' : isSubtitle ? '1.4rem' : '1rem',
        fontFamily: 'inherit'
      });
      const [hasSelection, setHasSelection] = useState(false);
      const [savedSelection, setSavedSelection] = useState({ start: 0, end: 0 });
      const [textareaRef, setTextareaRef] = useState(null);
      const [activeStyles, setActiveStyles] = useState({
        bold: false,
        italic: false,
        underline: false
      });
      const [showImageModal, setShowImageModal] = useState(false);
      const [imageUrl, setImageUrl] = useState('');

      // content나 저장된 스타일이 변경될 때 업데이트
      useEffect(() => {
        setEditValue(content);
        const savedStyle = data[`${field}_style`];
        if (savedStyle) {
          setCurrentStyle(savedStyle);
        }
      }, [content, data, field]);

      const handleClick = (e) => {
        if (isEditMode) {
          setIsEditing(true);
          setEditValue(content);
          
          // 툴바 위치 설정 - 화면 안에 위치하도록 조정
          const rect = e.currentTarget.getBoundingClientRect();
          const toolbarWidth = 600;
          const toolbarHeight = 80;
          
          let x = Math.max(10, rect.left);
          let y = rect.bottom + 20;
          
          // 화면 오른쪽을 벗어나면 왼쪽으로 이동
          if (x + toolbarWidth > window.innerWidth) {
            x = window.innerWidth - toolbarWidth - 10;
          }
          
          // 화면 아래쪽을 벗어나면 위쪽으로 이동
          if (y + toolbarHeight > window.innerHeight) {
            y = rect.top - toolbarHeight - 20;
          }
          
          setToolbarPosition({ x, y });
          setShowToolbar(true);
        }
      };

      const handleSave = () => {
        // 스타일이 적용된 텍스트로 저장
        const styledValue = editValue;
        handleTextEdit(field, styledValue);
        
        // 스타일 정보도 함께 저장 (섹션 데이터에 스타일 정보 추가)
        const styleField = `${field}_style`;
        handleTextEdit(styleField, currentStyle);
        
        setIsEditing(false);
        setShowToolbar(false);
        setShowColorPicker(false);
      };



      const handleCancel = () => {
        setEditValue(content);
        setIsEditing(false);
        setShowToolbar(false);
        setShowColorPicker(false);
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
          // Shift+Enter로 줄바꿈 허용 (모든 타입에서)
          return;
        } else if (e.key === 'Enter' && !e.shiftKey && isTitle) {
          // 제목에서는 Enter만으로 저장
          e.preventDefault();
          handleSave();
        } else if (e.key === 'Enter' && !e.shiftKey && !isTitle) {
          // 본문에서는 Enter로 줄바꿈 허용
          return;
        } else if (e.key === 'Escape') {
          handleCancel();
        }
      };

      const applyStyleToSelection = (styleType, value) => {
        if (!textareaRef) return;
        
        const start = savedSelection.start;
        const end = savedSelection.end;
        
        // 선택된 텍스트가 있으면 부분 적용, 없으면 전체 적용
        if (start !== end && hasSelection) {
          // 부분 텍스트에 마크다운 스타일 적용
          const beforeText = editValue.substring(0, start);
          const selectedText = editValue.substring(start, end);
          const afterText = editValue.substring(end);
          
          let styledText = selectedText;
          
          if (styleType === 'bold') {
            styledText = selectedText.startsWith('**') && selectedText.endsWith('**') 
              ? selectedText.slice(2, -2) 
              : `**${selectedText}**`;
          } else if (styleType === 'italic') {
            styledText = selectedText.startsWith('*') && selectedText.endsWith('*') && !selectedText.startsWith('**')
              ? selectedText.slice(1, -1) 
              : `*${selectedText}*`;
          } else if (styleType === 'underline') {
            styledText = selectedText.startsWith('__') && selectedText.endsWith('__')
              ? selectedText.slice(2, -2) 
              : `__${selectedText}__`;
          } else if (styleType === 'color') {
            // 색상 적용 - HTML span 태그 사용
            const colorPattern = /<span style="color: [^"]*">(.*?)<\/span>/g;
            if (selectedText.includes('<span style="color:')) {
              // 이미 색상이 적용된 경우 제거하고 새 색상 적용
              styledText = selectedText.replace(colorPattern, '$1');
              styledText = `<span style="color: ${value}">${styledText}</span>`;
            } else {
              // 새로운 색상 적용
              styledText = `<span style="color: ${value}">${selectedText}</span>`;
            }
          } else if (styleType === 'fontSize') {
            // 폰트 크기 적용
            const sizePattern = /<span style="font-size: [^"]*">(.*?)<\/span>/g;
            if (selectedText.includes('<span style="font-size:')) {
              styledText = selectedText.replace(sizePattern, '$1');
              styledText = `<span style="font-size: ${value}">${styledText}</span>`;
            } else {
              styledText = `<span style="font-size: ${value}">${selectedText}</span>`;
            }
          } else if (styleType === 'fontFamily') {
            // 폰트 패밀리 적용
            const fontPattern = /<span style="font-family: [^"]*">(.*?)<\/span>/g;
            if (selectedText.includes('<span style="font-family:')) {
              styledText = selectedText.replace(fontPattern, '$1');
              styledText = `<span style="font-family: ${value}">${styledText}</span>`;
            } else {
              styledText = `<span style="font-family: ${value}">${selectedText}</span>`;
            }
          } else if (styleType === 'image') {
            // 이미지 삽입 - 현재 커서 위치에 삽입
            const imageTag = `<img src="${value}" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />`;
            
            // 현재 커서 위치에 이미지 삽입
            const beforeText = editValue.substring(0, start);
            const afterText = editValue.substring(end);
            const newText = beforeText + imageTag + afterText;
            setEditValue(newText);
            
            // 커서를 이미지 다음 위치로 이동
            setTimeout(() => {
              if (textareaRef) {
                textareaRef.focus();
                const newPosition = start + imageTag.length;
                textareaRef.setSelectionRange(newPosition, newPosition);
              }
            }, 0);
            return; // 일반 처리를 건너뜀
          } else if (styleType === 'removeImage') {
            // 이미지 삭제
            if (start !== end && hasSelection) {
              const selectedText = editValue.substring(start, end);
              // 선택된 텍스트에서 이미지 태그 제거
              styledText = selectedText.replace(/<img[^>]*>/g, '');
            } else {
              // 전체 텍스트에서 모든 이미지 제거
              const newText = editValue.replace(/<img[^>]*>/g, '');
              setEditValue(newText);
              return;
            }
          }
          
          const newText = beforeText + styledText + afterText;
          setEditValue(newText);
          
          // 선택 영역을 새로운 위치로 조정
          setTimeout(() => {
            if (textareaRef) {
              textareaRef.focus();
              textareaRef.setSelectionRange(start, start + styledText.length);
            }
          }, 0);
        } else {
          // 전체 텍스트 스타일 변경
          if (styleType === 'bold') {
            setCurrentStyle(prev => ({ ...prev, bold: !prev.bold }));
          } else if (styleType === 'italic') {
            setCurrentStyle(prev => ({ ...prev, italic: !prev.italic }));
          } else if (styleType === 'underline') {
            setCurrentStyle(prev => ({ ...prev, underline: !prev.underline }));
          } else if (styleType === 'color') {
            setCurrentStyle(prev => ({ ...prev, color: value }));
          } else if (styleType === 'fontSize') {
            setCurrentStyle(prev => ({ ...prev, fontSize: value }));
          } else if (styleType === 'fontFamily') {
            setCurrentStyle(prev => ({ ...prev, fontFamily: value }));
          }
        }
      };

      // 선택 영역을 저장하는 함수
      const saveSelection = (e) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        setSavedSelection({ start, end });
        setHasSelection(start !== end);
        setTextareaRef(e.target);
      };

      // 마크다운을 HTML로 변환하는 함수
      const renderMarkdown = (text) => {
        if (!text) return text;
        
        return text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // **볼드**
          .replace(/\*(.*?)\*/g, '<em>$1</em>')              // *이탤릭*
          .replace(/__(.*?)__/g, '<u>$1</u>')                // __언더라인__
          .replace(/\n/g, '<br>');                           // 줄바꿈을 <br>로 변환
          // HTML span 태그는 그대로 유지 (색상, 폰트 크기, 폰트 패밀리)
      };

      // 편집 툴바 컴포넌트
      const EditToolbar = () => (
        <div 
          style={{
            position: 'fixed',
            left: toolbarPosition.x,
            top: toolbarPosition.y,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(15px)',
            border: '2px solid #8B1538',
            borderRadius: '15px',
            padding: '20px',
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            boxShadow: '0 10px 40px rgba(139, 21, 56, 0.3)',
            minWidth: '600px',
            flexWrap: 'wrap'
          }}
          onMouseDown={(e) => e.preventDefault()}
          onMouseUp={(e) => e.preventDefault()}
          onMouseEnter={() => setShowToolbar(true)}
          onMouseLeave={(e) => {
            // 툴바 영역에서 벗어날 때만 숨기기
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
              // 잠시 후에 숨기기 (사용자가 다시 돌아올 수 있도록)
              setTimeout(() => {
                if (!e.currentTarget.matches(':hover')) {
                  setShowToolbar(true); // 계속 표시
                }
              }, 100);
            }
          }}
        >
          {/* 편집 모드 표시 */}
          <div style={{
            background: 'rgba(0, 200, 0, 0.2)',
            border: '1px solid #00c000',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '10px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            ✏️ 편집 모드 {hasSelection && `(${savedSelection.end - savedSelection.start}자 선택)`}
          </div>
          {/* 폰트 패밀리 선택 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: 'white', fontSize: '10px', marginBottom: '4px' }}>폰트</label>
                         <select
               value={currentStyle.fontFamily}
               onChange={(e) => applyStyleToSelection('fontFamily', e.target.value)}
              style={{
                background: 'rgba(139, 21, 56, 0.2)',
                border: '1px solid #8B1538',
                borderRadius: '6px',
                color: 'white',
                padding: '6px 10px',
                fontSize: '12px',
                minWidth: '80px'
              }}
            >
              <option value="inherit">기본</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Times New Roman', serif">Times</option>
              <option value="'Courier New', monospace">Courier</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="'Noto Sans KR', sans-serif">한글</option>
            </select>
          </div>

          {/* 폰트 크기 선택 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: 'white', fontSize: '10px', marginBottom: '4px' }}>크기</label>
                         <select
               value={currentStyle.fontSize}
               onChange={(e) => applyStyleToSelection('fontSize', e.target.value)}
              style={{
                background: 'rgba(139, 21, 56, 0.2)',
                border: '1px solid #8B1538',
                borderRadius: '6px',
                color: 'white',
                padding: '6px 10px',
                fontSize: '12px',
                minWidth: '70px'
              }}
            >
              <option value="0.8rem">Small</option>
              <option value="1rem">보통</option>
              <option value="1.2rem">Medium</option>
              <option value="1.4rem">부제목</option>
              <option value="1.8rem">Large</option>
              <option value="2.2rem">X-Large</option>
              <option value="2.8rem">XX-Large</option>
              <option value="3.2rem">제목</option>
              <option value="4rem">Huge</option>
            </select>
          </div>

          {/* 이미지 삽입 버튼 - 현재 커서 위치에 삽입 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: 'white', fontSize: '10px', marginBottom: '4px' }}>이미지</label>
            <button
              onClick={() => {
                const url = prompt('Firebase 이미지 URL을 입력하세요:', 'https://firebasestorage.googleapis.com/');
                if (url && url.trim()) {
                  // 직접 현재 textarea의 커서 위치에서 이미지 삽입
                  if (textareaRef) {
                    const cursorStart = textareaRef.selectionStart || 0;
                    const cursorEnd = textareaRef.selectionEnd || 0;
                    
                    const imageTag = `<img src="${url.trim()}" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />`;
                    
                    const beforeText = editValue.substring(0, cursorStart);
                    const afterText = editValue.substring(cursorEnd);
                    const newText = beforeText + imageTag + afterText;
                    
                    setEditValue(newText);
                    
                    // 커서를 이미지 다음 위치로 이동
                    setTimeout(() => {
                      if (textareaRef) {
                        textareaRef.focus();
                        const newPosition = cursorStart + imageTag.length;
                        textareaRef.setSelectionRange(newPosition, newPosition);
                      }
                    }, 0);
                    
                    alert('이미지가 삽입되었습니다! 저장 버튼을 눌러주세요.');
                  } else {
                    // textarea가 없으면 끝에 추가
                    const imageTag = `<img src="${url.trim()}" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />`;
                    setEditValue(prev => prev + '\n\n' + imageTag + '\n\n');
                    alert('이미지가 삽입되었습니다! 저장 버튼을 눌러주세요.');
                  }
                }
              }}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                background: 'rgba(139, 21, 56, 0.2)',
                border: '1px solid #8B1538',
                borderRadius: '6px',
                color: 'white',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                minWidth: '60px'
              }}
              title="이미지 삽입"
            >
              🖼️ 삽입
            </button>
          </div>

          {/* 이미지 삭제 버튼 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: 'white', fontSize: '10px', marginBottom: '4px' }}>이미지</label>
            <button
              onClick={() => {
                if (confirm('선택된 이미지를 삭제하시겠습니까?')) {
                  applyStyleToSelection('removeImage', '');
                }
              }}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                background: 'rgba(139, 21, 56, 0.2)',
                border: '1px solid #8B1538',
                borderRadius: '6px',
                color: 'white',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                minWidth: '60px'
              }}
              title="이미지 삭제"
            >
              🗑️ 삭제
            </button>
          </div>

          {/* 스타일 버튼들 */}
          <div style={{ display: 'flex', gap: '6px' }}>
                                      <button
               onClick={() => applyStyleToSelection('bold')}
               onMouseDown={(e) => e.preventDefault()}
               style={{
                 background: currentStyle.bold ? '#8B1538' : 'rgba(139, 21, 56, 0.2)',
                 border: '1px solid #8B1538',
                 borderRadius: '6px',
                 color: 'white',
                 padding: '12px 15px',
                 cursor: 'pointer',
                 fontSize: '16px',
                 fontWeight: 'bold',
                 minWidth: '45px'
               }}
               title="굵게"
             >
               B
             </button>

                                      <button
               onClick={() => applyStyleToSelection('italic')}
               onMouseDown={(e) => e.preventDefault()}
               style={{
                 background: currentStyle.italic ? '#8B1538' : 'rgba(139, 21, 56, 0.2)',
                 border: '1px solid #8B1538',
                 borderRadius: '6px',
                 color: 'white',
                 padding: '12px 15px',
                 cursor: 'pointer',
                 fontSize: '16px',
                 fontStyle: 'italic',
                 minWidth: '45px'
               }}
               title="기울임"
             >
               I
             </button>

                                      <button
               onClick={() => applyStyleToSelection('underline')}
               onMouseDown={(e) => e.preventDefault()}
               style={{
                 background: currentStyle.underline ? '#8B1538' : 'rgba(139, 21, 56, 0.2)',
                 border: '1px solid #8B1538',
                 borderRadius: '6px',
                 color: 'white',
                 padding: '12px 15px',
                 cursor: 'pointer',
                 fontSize: '16px',
                 textDecoration: 'underline',
                 minWidth: '45px'
               }}
               title="밑줄"
             >
               U
             </button>
          </div>

          {/* 색상 선택 */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: 'white', fontSize: '10px', marginBottom: '4px' }}>색상</label>
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: currentStyle.color,
                border: '2px solid #8B1538',
                borderRadius: '6px',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="색상 선택"
            >
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '12px',
                height: '12px',
                background: '#8B1538',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                color: 'white'
              }}>▼</div>
            </div>
            
            {showColorPicker && (
              <div style={{
                position: 'absolute',
                top: '60px',
                left: '0',
                zIndex: 1001,
                background: 'rgba(0, 0, 0, 0.95)',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid #8B1538',
                boxShadow: '0 5px 20px rgba(0,0,0,0.5)'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(6, 1fr)', 
                  gap: '6px', 
                  width: '180px',
                  marginBottom: '10px'
                }}>
                  {[
                    '#ffffff', '#000000', '#8B1538', '#ff0000', '#00ff00', '#0000ff',
                    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000',
                    '#000080', '#800000', '#808080', '#c0c0c0', '#ff69b4', '#32cd32'
                  ].map(color => (
                    <div
                      key={color}
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: color,
                        border: currentStyle.color === color ? '3px solid #8B1538' : '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                                             onClick={() => {
                         applyStyleToSelection('color', color);
                         setShowColorPicker(false);
                       }}
                      title={color}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setShowColorPicker(false)}
                  style={{
                    width: '100%',
                    background: 'rgba(139, 21, 56, 0.3)',
                    border: '1px solid #8B1538',
                    borderRadius: '6px',
                    color: 'white',
                    padding: '6px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  닫기
                </button>
              </div>
            )}
          </div>

          {/* 이미지 URL 입력 모달 */}
          {showImageModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.95)',
                border: '2px solid #8B1538',
                borderRadius: '15px',
                padding: '30px',
                minWidth: '400px',
                maxWidth: '600px'
              }}>
                <h3 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
                  🖼️ 이미지 삽입
                </h3>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Firebase 이미지 URL을 입력하세요..."
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #8B1538',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    marginBottom: '20px'
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (imageUrl.trim()) {
                        applyStyleToSelection('image', imageUrl.trim());
                        setShowImageModal(false);
                        setImageUrl('');
                      }
                    } else if (e.key === 'Escape') {
                      setShowImageModal(false);
                      setImageUrl('');
                    }
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      if (imageUrl.trim()) {
                        applyStyleToSelection('image', imageUrl.trim());
                        setShowImageModal(false);
                        setImageUrl('');
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #00a000, #008000)',
                      border: '1px solid #00a000',
                      borderRadius: '8px',
                      color: 'white',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✅ 삽입
                  </button>
                  <button
                    onClick={() => {
                      setShowImageModal(false);
                      setImageUrl('');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #a00000, #800000)',
                      border: '1px solid #a00000',
                      borderRadius: '8px',
                      color: 'white',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    ❌ 취소
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 저장/취소 버튼 */}
          <div style={{ 
            marginLeft: 'auto', 
            display: 'flex', 
            gap: '8px',
            borderLeft: '1px solid rgba(139, 21, 56, 0.5)',
            paddingLeft: '15px'
          }}>
            <button
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #00a000, #008000)',
                border: '1px solid #00a000',
                borderRadius: '8px',
                color: 'white',
                padding: '12px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,160,0,0.3)'
              }}
            >
              💾 저장
            </button>
            <button
              onClick={handleCancel}
              style={{
                background: 'linear-gradient(135deg, #a00000, #800000)',
                border: '1px solid #a00000',
                borderRadius: '8px',
                color: 'white',
                padding: '12px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(160,0,0,0.3)'
              }}
            >
              ❌ 취소
            </button>
          </div>
        </div>
      );

      if (isEditing) {
        const Component = isTitle ? 'input' : 'textarea';
        return (
          <div className={className} style={{ position: 'relative' }}>
            {showToolbar && <EditToolbar />}
            <Component
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onSelect={saveSelection}
              onMouseUp={saveSelection}
              onKeyUp={saveSelection}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '3px solid #8B1538',
                borderRadius: '10px',
                padding: '20px 25px',
                fontSize: isTitle ? '2.2rem' : isSubtitle ? '1.2rem' : '1.1rem',
                fontWeight: currentStyle.bold ? 'bold' : (isTitle ? 'bold' : isSubtitle ? '600' : 'normal'),
                fontStyle: currentStyle.italic ? 'italic' : (isTitle ? 'italic' : 'normal'),
                textDecoration: currentStyle.underline ? 'underline' : 'none',
                color: currentStyle.color,
                fontFamily: currentStyle.fontFamily,
                outline: 'none',
                minHeight: isTitle ? '120px' : isSubtitle ? '140px' : '250px',
                resize: isTitle ? 'none' : 'vertical',
                lineHeight: '1.5',
                textAlign: 'left',
                boxShadow: '0 4px 20px rgba(139, 21, 56, 0.2)'
              }}
              placeholder={`${field} 내용을 입력하세요...`}
              autoFocus
            />
          </div>
        );
      }

      return (
        <div 
          className={className}
          onClick={handleClick}
          style={{
            cursor: isEditMode ? 'pointer' : 'default',
            border: isEditMode ? '2px dashed rgba(139, 21, 56, 0.4)' : 'none',
            borderRadius: '8px',
            padding: isEditMode ? '10px' : '0',
            transition: 'all 0.3s ease',
            backgroundColor: isEditMode ? 'rgba(139, 21, 56, 0.05)' : 'transparent',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (isEditMode) {
              e.currentTarget.style.backgroundColor = 'rgba(139, 21, 56, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(139, 21, 56, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (isEditMode) {
              e.currentTarget.style.backgroundColor = 'rgba(139, 21, 56, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(139, 21, 56, 0.4)';
            }
          }}
        >
          {isEditMode && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#8B1538',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              zIndex: 10
            }}>
              ✏️
            </div>
          )}
          
          {isTitle ? (
            <h1 style={{
              fontSize: currentStyle.fontSize || '3rem',
              fontWeight: currentStyle.bold ? 'bold' : 'normal',
              color: currentStyle.color || '#fff',
              fontStyle: currentStyle.italic ? 'italic' : 'normal',
              textDecoration: currentStyle.underline ? 'underline' : 'none',
              fontFamily: currentStyle.fontFamily || 'inherit',
              margin: 0,
              textTransform: 'lowercase',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              textAlign: 'left'
            }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          ) : isSubtitle ? (
            <h2 style={{
              fontSize: currentStyle.fontSize || '1.4rem',
              fontWeight: currentStyle.bold ? 'bold' : 'normal',
              color: currentStyle.color || '#8B1538',
              fontStyle: currentStyle.italic ? 'italic' : 'normal',
              textDecoration: currentStyle.underline ? 'underline' : 'none',
              fontFamily: currentStyle.fontFamily || 'inherit',
              margin: '0 0 2rem 0',
              lineHeight: '1.4',
              textAlign: 'left'
            }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          ) : (
            <p style={{
              fontSize: currentStyle.fontSize || '1rem',
              fontWeight: currentStyle.bold ? 'bold' : 'normal',
              color: currentStyle.color || '#333',
              fontStyle: currentStyle.italic ? 'italic' : 'normal',
              textDecoration: currentStyle.underline ? 'underline' : 'none',
              fontFamily: currentStyle.fontFamily || 'inherit',
              lineHeight: '1.7',
              margin: '0 0 1rem 0',
              textAlign: 'left'
            }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}
          

        </div>
      );
    };

    // Leadership 섹션만 완전히 새로 구현
    if (sectionId === 'leadership') {
      return (
        <div style={{
          minHeight: '200vh',
          backgroundImage: `url('${data.bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
          overflow: 'visible'
        }}>
          {/* 오버레이 - 밝게 수정 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
            zIndex: 1
          }} />

          <div style={{ 
            position: 'relative', 
            zIndex: 2, 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px 20px'
          }}>
            {/* 섹션 타이틀 */}
            <div style={{
              marginBottom: '80px',
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(-30px)',
              transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%',
              maxWidth: '1000px',
              padding: '0 60px'
            }}>
              <EditableTextBlock 
                content={data.title}
                field="title"
                isTitle={true}
              />
            </div>

            {/* 메인 콘텐츠 */}
            <div style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%',
              maxWidth: '1100px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
                             {/* 메인 콘텐츠 박스 */}
               <div style={{
                 background: 'transparent',
                 backdropFilter: 'blur(5px)',
                 borderRadius: '25px',
                 padding: '50px 60px',
                 boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                 border: '1px solid rgba(255, 255, 255, 0.2)',
                 marginBottom: '40px',
                 width: '100%',
                 maxWidth: '1000px'
               }}>
                                 {/* 주요 제목 */}
                 <div style={{ marginBottom: '3rem' }}>
                   <EditableTextBlock 
                     content={data.mainTitle}
                     field="mainTitle"
                     isSubtitle={true}
                   />
                 </div>

                                 {/* 주요 내용 */}
                 <div style={{ marginBottom: '2.5rem' }}>
                   <EditableTextBlock 
                     content={data.mainContent}
                     field="mainContent"
                   />
                 </div>

                                 

                                 {/* 추가 콘텐츠 섹션 */}
                 <div className="leadership-content" style={{
                   background: 'transparent',
                   borderRadius: '20px',
                   padding: '50px 60px',
                   marginTop: '60px',
                   border: '1px solid rgba(255, 255, 255, 0.1)',
                   width: '100%',
                   maxWidth: '1000px'
                 }}>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    marginBottom: '25px',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    Our Leadership Team
                  </h3>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    padding: '30px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8B1538 0%, #A91D47 100%)',
                      margin: '0 auto 20px auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {data.personName ? data.personName.charAt(0) : 'D'}
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <EditableTextBlock 
                        content={data.personName || 'David C. Kim'}
                        field="personName"
                        isSubtitle={false}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                      <EditableTextBlock 
                        content={data.personTitle || 'Chief Executive Officer'}
                        field="personTitle"
                        isSubtitle={false}
                      />
                    </div>
                    
                    <p style={{
                      color: '#fff',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      opacity: 0.8
                    }}>
                      Leading with vision and expertise in global investment management.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 스크롤 다운 표시 */}
          <div style={{
            position: 'fixed',
            bottom: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 25,
            animation: 'bounce 2s infinite'
          }}>
            <div style={{
              width: '30px',
              height: '50px',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '15px',
              position: 'relative',
              cursor: 'pointer'
            }}
            onClick={() => {
              const element = document.querySelector('.leadership-content');
              if (element) {
                element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }}
            >
              <div style={{
                width: '4px',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '2px',
                position: 'absolute',
                top: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'scroll 1.5s infinite'
              }} />
            </div>
          </div>

          {/* CSS 애니메이션 */}
          <style>{`
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% {
                transform: translateX(-50%) translateY(0);
              }
              40% {
                transform: translateX(-50%) translateY(-10px);
              }
              60% {
                transform: translateX(-50%) translateY(-5px);
              }
            }
            
            @keyframes scroll {
              0% {
                opacity: 0;
                transform: translateX(-50%) translateY(0);
              }
              50% {
                opacity: 1;
              }
              100% {
                opacity: 0;
                transform: translateX(-50%) translateY(15px);
              }
            }
          `}</style>

          {/* Back 버튼 */}
          <button
            onClick={() => setCurrentPage('main')}
            style={{
              position: 'fixed',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #8B1538 0%, #A91D47 100%)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '18px 35px',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 25px rgba(139, 21, 56, 0.4)',
              zIndex: 30,
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(-50%) translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 35px rgba(139, 21, 56, 0.5)';
              e.target.style.background = 'linear-gradient(135deg, #A91D47 0%, #C12654 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(-50%) translateY(0px) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(139, 21, 56, 0.4)';
              e.target.style.background = 'linear-gradient(135deg, #8B1538 0%, #A91D47 100%)';
            }}
          >
            ← Back to Main
          </button>
        </div>
      );
    }

    // 다른 섹션들은 기존 방식 유지 (나중에 적용)
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: `url('${data.bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '50px',
          borderRadius: '20px',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          <h1 style={{ color: '#8B1538', marginBottom: '20px' }}>{data.title}</h1>
          <p style={{ color: '#333', fontSize: '1.2rem' }}>
            이 섹션은 아직 새 버전으로 업데이트되지 않았습니다.<br/>
            Leadership 섹션을 먼저 확인해보세요!
          </p>
          <button
            onClick={() => setCurrentPage('main')}
            style={{
              marginTop: '30px',
              background: '#8B1538',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ← Back to Main
          </button>
        </div>
      </div>
    );
  };

      return (
    <div style={{ 
      width: '100vw', 
      minHeight: '100vh', 
      overflow: 'auto', 
      position: 'relative', 
      backgroundColor: '#000' 
    }}>
      {/* 편집 모드 토글 버튼 - 메인 페이지가 아닐 때만 표시 */}
      {currentPage !== 'main' && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 1000, 
          display: 'flex', 
          gap: '10px' 
        }}>
          <button
            onClick={() => {
              setIsEditMode(!isEditMode);
              if (isEditMode) {
                setEditingBlock(null);
                setColorPickerVisible(false);
                setShowToolbar(false);
              }
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: isEditMode ? '#DC2626' : '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            {isEditMode ? '편집 완료' : '편집 모드'}
          </button>
          {isEditMode && (
            <button
              onClick={() => {
                alert('변경사항이 저장되었습니다!');
                setIsEditMode(false);
                setEditingBlock(null);
                setShowToolbar(false);
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              <FaSave style={{ marginRight: '5px' }} />
              저장
            </button>
          )}
        </div>
      )}

      {/* 편집 툴바 - 분리된 컴포넌트 사용 */}
      <EditToolbar
        showToolbar={showToolbar}
        toolbarPosition={toolbarPosition}
        editingBlock={editingBlock}
        currentPage={currentPage}
        applyTextFormat={applyTextFormat}
        colorPickerVisible={colorPickerVisible}
        setColorPickerVisible={setColorPickerVisible}
        tempColor={tempColor}
        setTempColor={setTempColor}
        handleImageUpload={handleImageUpload}
        stopEditing={stopEditing}
      />



      {/* 실제 페이지 렌더링 */}
      {currentPage === 'main' && (
        <MainPage 
          sections={sections} 
          setCurrentPage={setCurrentPage} 
          menuVisible={menuVisible} 
        />
      )}
      {currentPage !== 'main' && <SectionPage sectionId={currentPage} />}
    </div>
  );
};

export default AgoraWebsite; 