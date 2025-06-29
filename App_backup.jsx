import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaBold, FaItalic, FaUnderline, FaPalette, FaPlus, FaTrash, FaEdit, FaImage, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { HexColorPicker } from 'react-colorful';
import EditableText from './components/EditableText';
import EditToolbar from './components/EditToolbar';
import MainPage from './components/MainPage';
import './App.css';

const AgoraWebsite = () => {
  // ========================================
  // 🔐 관리자 비밀번호 설정 (여기서 변경하세요!)
  // ========================================
  const ADMIN_PASSWORD = 'jake2025'; // 원하는 비밀번호로 변경하세요
  
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [editingBlock, setEditingBlock] = useState(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [tempColor, setTempColor] = useState('#333333');
  const [fontSizePickerVisible, setFontSizePickerVisible] = useState(false);
  const [fontPickerVisible, setFontPickerVisible] = useState(false);
  const [tempFontSize, setTempFontSize] = useState(16);
  const [tempFontFamily, setTempFontFamily] = useState('Arial, sans-serif');
  const [uploadingImage, setUploadingImage] = useState(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [currentEditingField, setCurrentEditingField] = useState(null);
  
  // 폰트 스타일 관련 상태 추가
  const [currentStyle, setCurrentStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    color: '#333333',
    fontSize: '1rem',
    fontFamily: 'inherit'
  });
  const [savedSelection, setSavedSelection] = useState({ start: 0, end: 0 });
  const [hasSelection, setHasSelection] = useState(false);
  const [textareaRef, setTextareaRef] = useState(null);
  const [editValue, setEditValue] = useState('');

  // 기본 섹션 데이터 (초기값)
  const defaultSectionData = {
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
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg1.jpg?alt=media&token=3cc87cd8-8ff3-461a-a56b-072e33a7455a',
      mainTitle: 'COMPREHENSIVE INVESTMENT SOLUTIONS',
      mainContent: 'Our diversified portfolio approach encompasses private equity, real estate development, hedge fund strategies, and innovative technology investments. We leverage cutting-edge analytics and global market insights to deliver superior returns for our clients.',
      subContent: 'From emerging markets to established economies, we identify and capitalize on opportunities that others overlook, creating value through strategic partnerships and disciplined execution.',
      footer: 'Investment Excellence Since 2020',
      personName: 'Sarah M. Chen',
      personTitle: 'Chief Investment Officer',
      personImage: null
    },
    itp: {
      title: 'ITP & capital market',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg1.jpg?alt=media&token=3cc87cd8-8ff3-461a-a56b-072e33a7455a',
      mainTitle: 'INNOVATIVE TECHNOLOGY PARTNERSHIPS',
      mainContent: 'We pioneer the integration of artificial intelligence and blockchain technologies into traditional investment frameworks. Our ITP division focuses on identifying and nurturing disruptive technologies that reshape entire industries.',
      subContent: 'Through strategic capital market operations, we facilitate seamless access to global liquidity while maintaining the highest standards of regulatory compliance and risk management.',
      footer: 'Technology Innovation Since 2020',
      personName: 'Michael R. Thompson',
      personTitle: 'Chief Technology Officer',
      personImage: null
    },
    redevelopment: {
      title: 'R.E. development',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg1.jpg?alt=media&token=3cc87cd8-8ff3-461a-a56b-072e33a7455a',
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
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg1.jpg?alt=media&token=3cc87cd8-8ff3-461a-a56b-072e33a7455a',
      mainTitle: 'LATEST NEWS & ANNOUNCEMENTS',
      mainContent: 'Stay informed about our latest developments, strategic partnerships, and market insights. We regularly share updates on our investment activities and industry perspectives.',
      subContent: 'Our commitment to transparency ensures that stakeholders are always informed about significant developments and opportunities within our organization.',
      footer: 'News & Updates 2024',
      personName: 'Robert K. Wilson',
      personTitle: 'Head of Communications',
      personImage: null
    }
  };

  // localStorage에서 데이터 불러오기 함수
  const loadSectionData = () => {
    try {
      const savedData = localStorage.getItem('agoraAssetSectionData');
      console.log('로드된 섹션 데이터:', savedData); // 디버깅용
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('파싱된 섹션 데이터:', parsedData); // 디버깅용
        return parsedData;
      }
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
    console.log('기본 섹션 데이터 사용'); // 디버깅용
    return defaultSectionData;
  };

  // 강제 데이터 새로고침 함수 추가
  const forceReloadSectionData = () => {
    const freshData = loadSectionData();
    setSectionData(freshData);
    console.log('섹션 데이터 강제 새로고침 완료:', freshData);
  };

  // 모든 섹션의 데이터를 통합 관리 (localStorage에서 불러오기)
  const [sectionData, setSectionData] = useState(loadSectionData);



  // 컴포넌트 마운트 후 데이터 재확인
  useEffect(() => {
    const timer = setTimeout(() => {
      forceReloadSectionData();
    }, 1000); // 1초 후 한 번 더 체크
    
    return () => clearTimeout(timer);
  }, []);

  // 기본 뉴스 데이터
  const defaultNewsItems = [
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
  ];

  // localStorage에서 뉴스 데이터 불러오기
  const loadNewsItems = () => {
    try {
      const savedNews = localStorage.getItem('agoraAssetNewsData');
      if (savedNews) {
        return JSON.parse(savedNews);
      }
    } catch (error) {
      console.error('뉴스 데이터 불러오기 실패:', error);
    }
    return defaultNewsItems;
  };

  const [newsItems, setNewsItems] = useState(loadNewsItems);

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
      // 편집 모드 종료
      setIsEditMode(false);
      setEditingBlock(null);
      
      // 메인 페이지로 돌아올 때 애니메이션 효과를 위해 잠시 대기 후 메뉴 표시
      setMenuVisible(false);
      const timer = setTimeout(() => {
        setMenuVisible(true);
      }, 200);
      
      return () => clearTimeout(timer);
    } else {
      // 다른 페이지로 이동할 때는 즉시 메뉴 숨김
      setMenuVisible(false);
    }
  }, [currentPage]);

  // 페이지 첫 로드 시 애니메이션 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []); // 빈 의존성 배열로 첫 로드 시에만 실행

  // 관리자 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 모바일에서는 관리자 로그인 비활성화
      if (window.innerWidth <= 768) return;
      
      // Ctrl+Alt+A로 관리자 로그인 창 열기
      if (e.ctrlKey && e.altKey && e.key === 'a') {
        e.preventDefault();
        setShowAdminLogin(true);
      }
      // ESC로 로그인 창 닫기
      if (e.key === 'Escape' && showAdminLogin) {
        setShowAdminLogin(false);
        setAdminPassword('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAdminLogin]);

  // 관리자 로그인 처리
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsEditMode(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      alert('관리자 모드로 로그인되었습니다!');
    } else {
      alert('비밀번호가 틀렸습니다.');
      setAdminPassword('');
    }
  };

  // 관리자 로그아웃
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
    alert('로그아웃되었습니다.');
  };

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
    setFontSizePickerVisible(false);
    setFontPickerVisible(false);
    setShowToolbar(false);
  }, []);

  const updateContent = useCallback((sectionId, field, value) => {
    setSectionData(prev => {
      const newData = {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          [field]: value
        }
      };
      
      // localStorage에 자동 저장
      try {
        localStorage.setItem('agoraAssetSectionData', JSON.stringify(newData));
      } catch (error) {
        console.error('데이터 저장 실패:', error);
      }
      
      return newData;
    });
  }, []);

  const applyFormatting = (sectionId, field, property, value) => {
    // 실제 편집 시 사용할 포맷팅 함수
    updateContent(sectionId, field, value);
  };

  // 뉴스 관리 함수들 - localStorage 자동 저장 포함
  const addNews = useCallback(() => {
    const newNews = {
      id: Date.now(),
      title: "새로운 공지사항",
      date: new Date().toISOString().split('T')[0],
      content: "새로운 공지사항 내용을 입력하세요."
    };
    setNewsItems(prev => {
      const newData = [newNews, ...prev];
      try {
        localStorage.setItem('agoraAssetNewsData', JSON.stringify(newData));
      } catch (error) {
        console.error('뉴스 데이터 저장 실패:', error);
      }
      return newData;
    });
  }, []);

  const updateNews = useCallback((id, field, value) => {
    // 입력값 검증
    if (!id || !field || value === undefined) return;
    
    setNewsItems(prev => {
      const newData = prev.map(item => 
        item.id === id ? { ...item, [field]: String(value).slice(0, 1000) } : item // 최대 1000자 제한
      );
      try {
        localStorage.setItem('agoraAssetNewsData', JSON.stringify(newData));
      } catch (error) {
        console.error('뉴스 데이터 저장 실패:', error);
      }
      return newData;
    });
  }, []);

  const deleteNews = useCallback((id) => {
    if (!id) return;
    setNewsItems(prev => {
      const newData = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('agoraAssetNewsData', JSON.stringify(newData));
      } catch (error) {
        console.error('뉴스 데이터 저장 실패:', error);
      }
      return newData;
    });
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
      case 'fontSize':
        // 폰트 크기 값 검증 (10px ~ 48px)
        const safeFontSize = Math.max(10, Math.min(48, parseInt(tempFontSize) || 16));
        newContent = `<span style="font-size: ${safeFontSize}px">${plainText.replace(/[<>]/g, '')}</span>`;
        break;
      case 'fontFamily':
        // 폰트 패밀리 값 검증
        const allowedFonts = [
          'Arial, sans-serif',
          'Times New Roman, serif',
          'Helvetica, sans-serif',
          'Georgia, serif',
          'Verdana, sans-serif',
          'Courier New, monospace',
          'Malgun Gothic, sans-serif',
          'Nanum Gothic, sans-serif',
          'Dotum, sans-serif',
          'Gulim, sans-serif',
          'Myriad Pro, sans-serif',
          'Arno Pro Display, serif'
        ];
        const safeFontFamily = allowedFonts.includes(tempFontFamily) ? tempFontFamily : 'Arial, sans-serif';
        newContent = `<span style="font-family: ${safeFontFamily}">${plainText.replace(/[<>]/g, '')}</span>`;
        break;
      default:
        newContent = plainText;
    }
    
    updateContent(sectionId, field, newContent);
  }, [sectionData, tempColor, tempFontSize, tempFontFamily, updateContent]);

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
      const [localEditValue, setLocalEditValue] = useState(content);
      const [localShowToolbar, setLocalShowToolbar] = useState(false);
      const [localToolbarPosition, setLocalToolbarPosition] = useState({ x: 0, y: 0 });
      const [showColorPicker, setShowColorPicker] = useState(false);
      
      // 저장된 스타일 정보를 불러오기
      const savedStyle = data[`${field}_style`];
      const [localCurrentStyle, setLocalCurrentStyle] = useState(savedStyle || {
        bold: isTitle ? true : isSubtitle ? true : false,
        italic: isTitle ? true : false,
        underline: false,
        color: isTitle ? '#ffffff' : isSubtitle ? '#8B1538' : '#333333',
        fontSize: isTitle ? '32px' : isSubtitle ? '20px' : '16px',
        fontFamily: 'inherit'
      });
      const [localHasSelection, setLocalHasSelection] = useState(false);
      const [localSavedSelection, setLocalSavedSelection] = useState({ start: 0, end: 0 });
      const [localTextareaRef, setLocalTextareaRef] = useState(null);
      const [activeStyles, setActiveStyles] = useState({
        bold: false,
        italic: false,
        underline: false
      });
      const [showImageModal, setShowImageModal] = useState(false);
      const [imageUrl, setImageUrl] = useState('');

      // content나 저장된 스타일이 변경될 때 업데이트
      useEffect(() => {
        setLocalEditValue(content || '');
        
        const savedStyle = data[`${field}_style`];
        if (savedStyle) {
          setLocalCurrentStyle(savedStyle);
        }
      }, [content, data, field]);

      const handleClick = (e) => {
        // 모바일에서는 편집 기능 비활성화
        const isMobile = window.innerWidth <= 768;
        if (isMobile) return;
        
        if (isEditMode && isAdmin) {
          setIsEditing(true);
          setLocalEditValue(content || '');
          
          // 툴바 위치 설정 - 화면 맨 아래에 고정
          const rect = e.currentTarget.getBoundingClientRect();
          const toolbarWidth = 600;
          const toolbarHeight = 80;
          
          // 화면 아래쪽 중앙에 고정 (Back button 위로)
          let x = (window.innerWidth - toolbarWidth) / 2;
          let y = window.innerHeight - toolbarHeight - 100;
          
          // 최소 여백 확보
          x = Math.max(10, x);
          y = Math.max(10, y);
          
          setLocalToolbarPosition({ x, y });
          setLocalShowToolbar(true);
        }
      };

      const handleSave = () => {
        // 단순히 현재 편집 중인 텍스트를 저장
        handleTextEdit(field, localEditValue);
        
        // 스타일 정보도 함께 저장
        const styleField = `${field}_style`;
        handleTextEdit(styleField, localCurrentStyle);
        
        setIsEditing(false);
        setLocalShowToolbar(false);
        setShowColorPicker(false);
      };



      const handleCancel = () => {
        setLocalEditValue(content || '');
        setIsEditing(false);
        setLocalShowToolbar(false);
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
        if (!localTextareaRef) return;
        
        // 현재 선택 영역을 실시간으로 가져오기
        const currentStart = localTextareaRef.selectionStart || 0;
        const currentEnd = localTextareaRef.selectionEnd || 0;
        
        // 선택된 텍스트가 있는지 확인
        const hasSelection = currentStart !== currentEnd && currentStart >= 0 && currentEnd > currentStart;
        
        console.log('선택 상태:', { currentStart, currentEnd, hasSelection, selectedText: localEditValue.substring(currentStart, currentEnd) });
        
        // 선택된 텍스트가 있으면 부분 적용
        if (hasSelection) {
          // 부분 텍스트에 마크다운 스타일 적용
          const beforeText = localEditValue.substring(0, currentStart);
          const selectedText = localEditValue.substring(currentStart, currentEnd);
          const afterText = localEditValue.substring(currentEnd);
          
          let styledText = selectedText;
          
          if (styleType === 'bold') {
            // HTML strong 태그 사용
            const boldPattern = /<strong>(.*?)<\/strong>/g;
            if (selectedText.includes('<strong>')) {
              // 이미 볼드가 적용된 경우 제거
              styledText = selectedText.replace(boldPattern, '$1');
            } else {
              // 새로운 볼드 적용
              styledText = `<strong>${selectedText}</strong>`;
            }
          } else if (styleType === 'italic') {
            // HTML em 태그 사용
            const italicPattern = /<em>(.*?)<\/em>/g;
            if (selectedText.includes('<em>')) {
              // 이미 이탤릭이 적용된 경우 제거
              styledText = selectedText.replace(italicPattern, '$1');
            } else {
              // 새로운 이탤릭 적용
              styledText = `<em>${selectedText}</em>`;
            }
          } else if (styleType === 'underline') {
            // HTML u 태그 사용
            const underlinePattern = /<u>(.*?)<\/u>/g;
            if (selectedText.includes('<u>')) {
              // 이미 언더라인이 적용된 경우 제거
              styledText = selectedText.replace(underlinePattern, '$1');
            } else {
              // 새로운 언더라인 적용
              styledText = `<u>${selectedText}</u>`;
            }
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
            const beforeText = localEditValue.substring(0, currentStart);
            const afterText = localEditValue.substring(currentEnd);
            const newText = beforeText + imageTag + afterText;
            setLocalEditValue(newText);
            
            // 커서를 이미지 다음 위치로 이동
            setTimeout(() => {
              if (localTextareaRef) {
                localTextareaRef.focus();
                const newPosition = currentStart + imageTag.length;
                localTextareaRef.setSelectionRange(newPosition, newPosition);
              }
            }, 0);
            return; // 일반 처리를 건너뜀
          } else if (styleType === 'removeImage') {
            // 이미지 삭제
            if (hasSelection) {
              const selectedText = localEditValue.substring(currentStart, currentEnd);
              // 선택된 텍스트에서 이미지 태그 제거
              styledText = selectedText.replace(/<img[^>]*>/g, '');
            } else {
              // 전체 텍스트에서 모든 이미지 제거
              const newText = localEditValue.replace(/<img[^>]*>/g, '');
              setLocalEditValue(newText);
              return;
            }
          }
          
          const newText = beforeText + styledText + afterText;
          setLocalEditValue(newText);
          
          // 선택 영역을 새로운 위치로 조정
          setTimeout(() => {
            if (localTextareaRef) {
              localTextareaRef.focus();
              localTextareaRef.setSelectionRange(currentStart, currentStart + styledText.length);
            }
          }, 0);
        } else {
          // 선택된 텍스트가 없으면 아무것도 하지 않음
          alert('텍스트를 선택한 후 스타일을 적용해주세요.');
          return;
        }
      };

      // 선택 영역을 저장하는 함수
      const saveSelection = (e) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        setLocalSavedSelection({ start, end });
        setLocalHasSelection(start !== end);
        setLocalTextareaRef(e.target);
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
            left: localToolbarPosition.x,
            top: localToolbarPosition.y,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.95)',
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
          onMouseEnter={() => setLocalShowToolbar(true)}
          onMouseLeave={(e) => {
            // 툴바 영역에서 벗어날 때만 숨기기
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
              // 잠시 후에 숨기기 (사용자가 다시 돌아올 수 있도록)
              setTimeout(() => {
                if (!e.currentTarget.matches(':hover')) {
                  setLocalShowToolbar(true); // 계속 표시
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
            ✏️ 편집 모드 {localHasSelection && `(${localSavedSelection.end - localSavedSelection.start}자 선택)`}
          </div>
                    {/* 폰트 패밀리 선택 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: 'white', fontSize: '10px', marginBottom: '4px' }}>폰트</label>
            <select
              value={localCurrentStyle.fontFamily}
              onChange={(e) => {
                applyStyleToSelection('fontFamily', e.target.value);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              style={{
                background: '#2a2a2a',
                border: '1px solid #8B1538',
                borderRadius: '6px',
                color: 'white',
                padding: '6px 10px',
                fontSize: '12px',
                minWidth: '80px',
                cursor: 'pointer'
              }}
            >
              <option value="inherit" style={{background: '#2a2a2a', color: 'white'}}>기본</option>
              <option value="Arial, sans-serif" style={{background: '#2a2a2a', color: 'white'}}>Arial</option>
              <option value="Times New Roman, serif" style={{background: '#2a2a2a', color: 'white'}}>Times New Roman</option>
              <option value="Helvetica, sans-serif" style={{background: '#2a2a2a', color: 'white'}}>Helvetica</option>
              <option value="Georgia, serif" style={{background: '#2a2a2a', color: 'white'}}>Georgia</option>
              <option value="Verdana, sans-serif" style={{background: '#2a2a2a', color: 'white'}}>Verdana</option>
              <option value="Courier New, monospace" style={{background: '#2a2a2a', color: 'white'}}>Courier New</option>
              <option value="Malgun Gothic, sans-serif" style={{background: '#2a2a2a', color: 'white'}}>맑은 고딕</option>
              <option value="Nanum Gothic, sans-serif" style={{background: '#2a2a2a', color: 'white'}}>나눔고딕</option>
              <option value="Dotum, sans-serif" style={{background: '#2a2a2a', color: 'white'}}>돋움</option>
              <option value="Gulim, sans-serif" style={{background: '#2a2a2a', color: 'white'}}>굴림</option>
              <option value="Myriad Pro, sans-serif" style={{background: '#2a2a2a', color: 'white'}}>Myriad Pro</option>
              <option value="Arno Pro Display, serif" style={{background: '#2a2a2a', color: 'white'}}>Arno Pro Display</option>
            </select>
          </div>

                    {/* 폰트 크기 선택 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ color: 'white', fontSize: '10px', marginBottom: '4px' }}>크기</label>
            <select
              value={localCurrentStyle.fontSize}
              onChange={(e) => {
                applyStyleToSelection('fontSize', e.target.value);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              style={{
                background: '#2a2a2a',
                border: '1px solid #8B1538',
                borderRadius: '6px',
                color: 'white',
                padding: '6px 10px',
                fontSize: '12px',
                minWidth: '70px',
                cursor: 'pointer'
              }}
            >
              <option value="10px" style={{background: '#2a2a2a', color: 'white'}}>10px</option>
              <option value="12px" style={{background: '#2a2a2a', color: 'white'}}>12px</option>
              <option value="14px" style={{background: '#2a2a2a', color: 'white'}}>14px</option>
              <option value="16px" style={{background: '#2a2a2a', color: 'white'}}>16px</option>
              <option value="18px" style={{background: '#2a2a2a', color: 'white'}}>18px</option>
              <option value="20px" style={{background: '#2a2a2a', color: 'white'}}>20px</option>
              <option value="24px" style={{background: '#2a2a2a', color: 'white'}}>24px</option>
              <option value="28px" style={{background: '#2a2a2a', color: 'white'}}>28px</option>
              <option value="32px" style={{background: '#2a2a2a', color: 'white'}}>32px</option>
              <option value="36px" style={{background: '#2a2a2a', color: 'white'}}>36px</option>
              <option value="42px" style={{background: '#2a2a2a', color: 'white'}}>42px</option>
              <option value="48px" style={{background: '#2a2a2a', color: 'white'}}>48px</option>
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
                  if (localTextareaRef) {
                    const cursorStart = localTextareaRef.selectionStart || 0;
                    const cursorEnd = localTextareaRef.selectionEnd || 0;
                    
                    const imageTag = `<img src="${url.trim()}" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />`;
                    
                    const beforeText = localEditValue.substring(0, cursorStart);
                    const afterText = localEditValue.substring(cursorEnd);
                    const newText = beforeText + imageTag + afterText;
                    
                    setLocalEditValue(newText);
                    
                    // 커서를 이미지 다음 위치로 이동
                    setTimeout(() => {
                      if (localTextareaRef) {
                        localTextareaRef.focus();
                        const newPosition = cursorStart + imageTag.length;
                        localTextareaRef.setSelectionRange(newPosition, newPosition);
                      }
                    }, 0);
                    
                    alert('이미지가 삽입되었습니다! 저장 버튼을 눌러주세요.');
                  } else {
                    // textarea가 없으면 끝에 추가
                    const imageTag = `<img src="${url.trim()}" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />`;
                    setLocalEditValue(prev => prev + '\n\n' + imageTag + '\n\n');
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
            {localShowToolbar && <EditToolbar />}
            <Component
              value={localEditValue}
              onChange={(e) => setLocalEditValue(e.target.value)}
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
                fontSize: localCurrentStyle.fontSize || (isTitle ? '2.2rem' : isSubtitle ? '1.2rem' : '1.1rem'),
                fontWeight: localCurrentStyle.bold ? 'bold' : (isTitle ? 'bold' : isSubtitle ? '600' : 'normal'),
                fontStyle: localCurrentStyle.italic ? 'italic' : (isTitle ? 'italic' : 'normal'),
                textDecoration: localCurrentStyle.underline ? 'underline' : 'none',
                color: localCurrentStyle.color,
                fontFamily: localCurrentStyle.fontFamily !== 'inherit' ? localCurrentStyle.fontFamily : 'inherit',
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
            cursor: (isEditMode && window.innerWidth > 768) ? 'pointer' : 'default',
            border: (isEditMode && window.innerWidth > 768) ? '2px dashed rgba(139, 21, 56, 0.4)' : 'none',
            borderRadius: '8px',
            padding: (isEditMode && window.innerWidth > 768) ? '10px' : '0',
            transition: 'all 0.3s ease',
            backgroundColor: (isEditMode && window.innerWidth > 768) ? 'rgba(139, 21, 56, 0.05)' : 'transparent',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (isEditMode && window.innerWidth > 768) {
              e.currentTarget.style.backgroundColor = 'rgba(139, 21, 56, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(139, 21, 56, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (isEditMode && window.innerWidth > 768) {
              e.currentTarget.style.backgroundColor = 'rgba(139, 21, 56, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(139, 21, 56, 0.4)';
            }
          }}
        >
          {(isEditMode && window.innerWidth > 768) && (
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
          
          {(() => {
            // 이미지는 유지하고 마크다운을 HTML로 변환하는 함수
            const processTextWithMarkdown = (text) => {
              if (!text) return '';
              
              // 이미지가 포함되어 있으면 HTML 렌더링 사용
              if (text.includes('<img')) {
                return <div dangerouslySetInnerHTML={{ __html: text }} />;
              }
              
              // 마크다운을 HTML로 변환
              let processedText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **볼드**
                .replace(/\*(.*?)\*/g, '<em>$1</em>')             // *이탤릭*
                .replace(/__(.*?)__/g, '<u>$1</u>')               // __언더라인__
                .replace(/\n/g, '<br>');                          // 줄바꿈
              
              // HTML이 포함되어 있으면 dangerouslySetInnerHTML 사용
              if (processedText.includes('<')) {
                return <div dangerouslySetInnerHTML={{ __html: processedText }} />;
              }
              
              // 순수 텍스트면 그대로 반환
              return processedText;
            };

            const processedContent = processTextWithMarkdown(content);

            if (isTitle) {
              return (
                <h1 style={{
                  fontSize: window.innerWidth <= 768 ? '2rem' : window.innerWidth <= 1024 ? '2.5rem' : '3rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  fontStyle: 'italic',
                  margin: 0,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  textAlign: 'left',
                  textTransform: 'lowercase'
                }}>
                  {processedContent}
                </h1>
              );
            } else if (isSubtitle) {
              return (
                <h2 style={{
                  fontSize: window.innerWidth <= 768 ? '1.1rem' : '1.4rem',
                  fontWeight: 'bold',
                  color: '#8B1538',
                  margin: '0 0 2rem 0',
                  lineHeight: '1.4',
                  textAlign: 'left',
                  letterSpacing: '0.5px'
                }}>
                  {processedContent}
                </h2>
              );
            } else {
              return (
                <p style={{
                  fontSize: '1rem',
                  color: '#333',
                  lineHeight: '1.7',
                  margin: '0 0 1rem 0',
                  textAlign: 'left'
                }}>
                  {processedContent}
                </p>
              );
            }
          })()}
          

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
          {/* 오버레이 제거 */}

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
              marginBottom: window.innerWidth <= 768 ? '40px' : '80px',
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(-30px)',
              transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%',
              maxWidth: '1000px',
                            padding: '0 80px'
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
            alignItems: 'center',
            padding: '0 80px'
          }}>
            {/* 메인 콘텐츠 박스 */}
            <div style={{
              background: 'transparent',
              borderRadius: window.innerWidth <= 768 ? '15px' : '30px',
              padding: window.innerWidth <= 768 ? '40px 0px' : '80px',
              marginBottom: '40px',
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto 40px auto',
              boxSizing: 'border-box'
            }}>
              {/* 주요 제목 */}
              <div style={{ 
                marginBottom: '3rem',
                padding: '0 80px'
              }}>
                <EditableTextBlock 
                  content={data.mainTitle}
                  field="mainTitle"
                  isSubtitle={true}
                />
              </div>

              {/* 주요 내용 */}
              <div style={{ 
                marginBottom: '2.5rem',
                padding: '0 80px'
              }}>
                <EditableTextBlock 
                  content={data.mainContent}
                  field="mainContent"
                />
              </div>

                                 

                
              </div>
            </div>
          </div>





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
              zIndex: 30
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

    // 나머지 모든 섹션들도 동일한 스타일 적용
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
        {/* 오버레이 제거 */}

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
            marginBottom: window.innerWidth <= 768 ? '40px' : '80px',
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(-30px)',
            transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%',
            maxWidth: '1000px',
            padding: '0 80px'
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
            alignItems: 'center',
            padding: '0 80px'
          }}>
            {/* 메인 콘텐츠 박스 */}
            <div style={{
              background: 'transparent',
              borderRadius: window.innerWidth <= 768 ? '15px' : '30px',
              padding: window.innerWidth <= 768 ? '40px 0px' : '80px',
              marginBottom: '40px',
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto 40px auto',
              boxSizing: 'border-box'
            }}>
              {/* 주요 제목 */}
              <div style={{ 
                marginBottom: '3rem',
                padding: '0 80px'
              }}>
                <EditableTextBlock 
                  content={data.mainTitle}
                  field="mainTitle"
                  isSubtitle={true}
                />
              </div>

              {/* 주요 내용 */}
              <div style={{ 
                marginBottom: '2.5rem',
                padding: '0 80px'
              }}>
                <EditableTextBlock 
                  content={data.mainContent}
                  field="mainContent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Back 버튼 */}
        <button
          onClick={() => setCurrentPage('main')}
          style={{
            position: 'fixed',
            bottom: window.innerWidth <= 768 ? '30px' : '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #8B1538 0%, #A91D47 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: window.innerWidth <= 768 ? '16px 28px' : '18px 35px',
            borderRadius: '50px',
            fontSize: window.innerWidth <= 768 ? '1rem' : '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 25px rgba(139, 21, 56, 0.4)',
            zIndex: 30
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
  };

      return (
    <div style={{ 
      width: '100vw', 
      minHeight: '100vh', 
      overflow: 'auto', 
      position: 'relative', 
      backgroundColor: '#000' 
    }}>
      {/* 관리자 상태 표시 및 편집 모드 토글 버튼 */}
      {currentPage !== 'main' && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 1000, 
          display: 'flex', 
          gap: '10px' 
        }}>
          {/* 관리자 상태 표시 */}
          {isAdmin && (
            <div style={{
              padding: '8px 15px',
              backgroundColor: '#059669',
              color: 'white',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              👑 관리자 모드
            </div>
          )}
          
          {/* 편집 모드 토글 버튼 - 관리자만 표시, 모바일에서는 숨김 */}
          {isAdmin && window.innerWidth > 768 && (
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
          )}
          
          {/* 로그아웃 버튼 */}
          {isAdmin && (
            <button
              onClick={handleAdminLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              로그아웃
            </button>
          )}
          {(isEditMode && window.innerWidth > 768) && (
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
        fontSizePickerVisible={fontSizePickerVisible}
        setFontSizePickerVisible={setFontSizePickerVisible}
        fontPickerVisible={fontPickerVisible}
        setFontPickerVisible={setFontPickerVisible}
        tempFontSize={tempFontSize}
        setTempFontSize={setTempFontSize}
        tempFontFamily={tempFontFamily}
        setTempFontFamily={setTempFontFamily}
      />



      {/* 관리자 로그인 모달 */}
      {showAdminLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            padding: window.innerWidth <= 768 ? '30px 20px' : '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            minWidth: window.innerWidth <= 768 ? '320px' : '400px',
            maxWidth: window.innerWidth <= 768 ? '90vw' : '400px',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#fff',
              marginBottom: '30px',
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}>
              🔐 관리자 로그인
            </h2>
            
            <div style={{ marginBottom: '25px' }}>
              <input
                type="password"
                placeholder="관리자 비밀번호를 입력하세요"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAdminLogin();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            </div>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={handleAdminLogin}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#047857';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                로그인
              </button>
              
              <button
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminPassword('');
                }}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#B91C1C';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#DC2626';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                취소
              </button>
            </div>
            
            <div style={{
              marginTop: '20px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontStyle: 'italic'
            }}>
              힌트: Ctrl + Alt + A 키로 로그인 창을 열 수 있습니다
            </div>
          </div>
        </div>
      )}

      {/* 실제 페이지 렌더링 */}
      {currentPage === 'main' && (
        <MainPage 
          key={menuVisible ? 'main-visible' : 'main-hidden'}
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