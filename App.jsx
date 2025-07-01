import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaBold, FaItalic, FaUnderline, FaPalette, FaPlus, FaTrash, FaEdit, FaImage, FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { HexColorPicker } from 'react-colorful';
import EditableText from './components/EditableText';
import EditToolbar from './components/EditToolbar';
import MainPage from './components/MainPage';
// Firebase Firestore 임시 비활성화 (안정성 우선)
// import { useFirestoreData, useNewsData } from './src/hooks/useFirestore';
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

  // 기본 섹션 데이터 (완성본)
  const defaultSectionData = {
    leadership: {
      title: 'leadership',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg1.jpg?alt=media&token=3cc87cd8-8ff3-461a-a56b-072e33a7455a',
      mainTitle: '<span style="font-family: Myriad Pro, sans-serif">GLOBAL & DYNAMIC INVESTMENT MANAGEMENT</span>',
      mainContent: '<br /><span style="font-size: 20px"><span style="font-family: Arno Pro Display, serif"><em><span style="font-size: 22px"><span style="font-family: Arno Pro Display, serif"><p style="line-height: 1.6;">At the heart of our solutions lies the power of global insights, driven by our extensive expertise in private equity, real estate funds, hedge fund strategies, and credit investments. Our foundation is built on robust intellectual prowess and substantial financial strength, empowering us to deliver exceptional outcomes. <br />\nWe pride ourselves on attracting top-tier talent and nurturing a culture that values innovation, independent thinking, and unwavering integrity. With a firm commitment backed by a strong capital base, we confidently deliver on our promises and create lasting value for our partners and clients.\n</span></span></em></span></span></span></span>\n<br />\n\n<img src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fdavid-pic30.png?alt=media&token=259e29b3-6865-4415-97c2-f53a9afde131" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />\n\n<p style="line-height: 1.6;"><span style="font-family: Arno Pro Display, serif">At Agora Asset, we deeply understand the complexities of today\'s evolving global landscape.\nOur commitment is rooted in authenticity, strategic insight, and innovative thinking. \nWith a solid foundation built on trust, financial strength, and genuine partnership,\nwe strive to meet the unique goals of each investor we serve.<br /><br />\nIn an environment marked by economic and geopolitical shifts, we believe in the power of agility, \nregional expertise, and meticulous bottom-up analysis. <br />Agora Asset leverages these strengths to navigate uncertainties, uncover opportunities, <br />and deliver meaningful, sustainable outcomes.<br /><br />\nOur ultimate goal is to build sincere, lasting relationships by consistently placing our clients\' best interests \nat the core of our decisions and actions.<br /><br />\nDavid C. Kim<br />\nChief Executive Office</span></span>r<br />\nAgora Asset Inc.</span></span></span></span></span>\n<br /><br /><br /><br /></span>\n<img src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fagora-logo-ys.png?alt=media&token=aa0f1429-0a24-4227-b764-8b2051a59b6e" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />\n<br /><br />\n<span style="font-family: Myriad Pro, sans-serif"><span style="font-size: 14px"><p style="line-height: 1.4;"><span style="color: #800000"><strong><span style="font-family: Myriad Pro, sans-serif"><span style="font-size: 20px">AGORA ASSET INC. – EXECUTIVE TEAM</span></strong></span><br />\n<span style="font-size: 14px"><span style="font-family: Myriad Pro, sans-serif"><strong>DAVID C. KIM</strong> <br />Chief Executive Officer / Chairman, Korea\n<br />•\tUniversity of Southern California (USC)\n<br />•\tFounder, Inglewood Trust LLC; Advisor, Global Jewish Funds (Asia Pacific)\n<br />•\tSpecialist in bond transactions, global financial brokerage, and commodities (DKI Investment)\n<br />•\tPreviously ExxonMobil Petroleum Finance Department; CEO, Unicor Inc., Korea<br />\n<strong>KENNETH RO</strong> <br />Senior Managing Director & Chief Financial Officer, USA\n<br />•\tBachelor of Science in Finance, University of Southern California\n<br />•\tFormer Vice President at Deutsche Bank, Morgan Stanley, UBS<br />\n<strong>CHANG SEON SHIN</strong> <br />Chief Legal Officer, Legal & Compliance, Korea\n<br />•\tDoctor of Jurisprudence (Dr. Jur.), University of Hamburg, Germany\n<br />•\tFormer Member, Securities Supervisory Board, Korea\n<br />•\tExpert Advisor, Korea Securities and Exchange Commission\n<br />•\tFormer Dean, College of Law, Chonnam National University<br />\n<strong>RUSSELL KENT RAMAGE MILES</strong> <br />Senior Managing Director, Private Equity Finance, Singapore\n<br />•\tMCS-DS (Hons.), Stanford University\n<br />•\tBBA, LL.B (Hons.) Law with Business, King\'s College London\n<br />•\tExperienced in oil exploration seismic systems; financial business consultant<br />\n<strong>ZUHRI SUKRI </strong><br />Senior Managing Director, Business Relationship, Singapore\n<br />•\tFormerly with World Airways, United Airlines, Singapore Airlines\n<br />•\tSpecialist in crude oil, petrochemical sectors, private equity finance<br />\n<strong>HENRY GOH</strong> <br />Senior Managing Director, Private Equity Finance, Singapore\n<br />•\tRoyal Military Academy Sandhurst, UK\n<br />•\tFormer roles at Huawei Marine Networks, 3A Capital Ltd.\n<br />•\tFinancial business advisor and consultant<br />\n<strong>KYLE OH </strong><br />Managing Director, Private Equity Finance, USA\n<br />•\tBusiness Degree, San Francisco State University\n<br />•\tExperienced with GMA International Trading, BJ Global Advisors, GF Asset Advisors, AIG<br />\n<strong>JAKE H. CHOI </strong><br />Managing Director, Marketing & Communications, USA\n<br />•\tColumbia University; Academy of Art, San Francisco\n<br />•\tFormer roles at Leo Burnett Chicago, Daehong Communications (Lotte Group, Korea)\n<br />•\tFormer VP/ECD at INNOVASIA Los Angeles<br />\n<strong>KEVIN MIN </strong><br />Managing Director, Real Estate & Business Planning, Korea<br />\n<strong>BYUNG SEOL MIN</strong> <br />Director, Business Relationship, Korea<br />\n<strong>CHRISTINA KIM</strong> <br />Director, Corporate Secretary & Accountant, USA\n<br />•\tUniversity of California, Riverside\n<br />•\tFormer roles at Southern Cal Law Firm, Bank of Hope, Los Angeles<br /><br />\n<span style="color: #8B1538"><strong><span style="font-size: 20px"><span style="font-family: Myriad Pro, sans-serif">AFFILIATE TEAM MEMBERS</span></span></strong></span><br />\n<strong>GENE S. DEVERAUX, SR.</strong> <br />Senior Advisor, Innovation & Technology\n<br />•\tOver 40 years of experience driving innovative technological solutions across diverse industries\n<br />•\tDeveloped proprietary hydro-electric generation systems without traditional dams\n<br />•\tExtensive network with global financial institutions including AAA insurers, currency traders, and major banks\n<br />•\tExpertise in sustainable energy solutions and structured project financing<br /><br />\n<strong>THOMAS MATHEW</strong> <br />Project Manager & Senior Advisor, Oil, Gas & Chemicals\n<br />•\tOver 50 years of experience in chemical engineering and managing EPC projects in petrochemical, refining, and LNG sectors\n<br />•\tPlayed key roles in major global projects including Reliance Jamnagar Petcoke Gasification\n<br />•\tManaged large-scale LNG plants, refinery expansions, offshore/onshore field developments, and pipeline construction\n<br />•\tExpert in end-to-end project lifecycle management, risk mitigation, and strategic consulting\n</span></span><br /><br /><br /><br /></span></span></span>',
      subContent: 'We passionately build lasting relationships, committed to placing our clients\' ambitions at the heart of every decision, paving the way for sustainable success and mutual growth.',
      footer: 'Leadership Excellence Since 2020',
      personName: 'David C. Kim',
      personTitle: 'Chief Executive Officer',
      personImage: null,
      mainTitle_style: {
        bold: true,
        italic: false,
        underline: false,
        color: '#8B1538',
        fontSize: '20px',
        fontFamily: 'inherit'
      },
      mainContent_style: {
        bold: false,
        italic: false,
        underline: false,
        color: '#333333',
        fontSize: '16px',
        fontFamily: 'inherit'
      }
    },
    whatwedo: {
      title: 'what we do',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg1.jpg?alt=media&token=3cc87cd8-8ff3-461a-a56b-072e33a7455a',
      mainTitle: 'COMPREHENSIVE INVESTMENT SOLUTIONS',
      mainContent: '\n<em><span style="font-size: 22px"><span style="font-family: Arno Pro Display, serif">"Driven by a passion for innovation and a deep understanding of global markets, AGORA Asset delivers intelligent investment solutions, transformative urban projects, and future-ready technologies. From resilient portfolio strategies to cutting-edge AI platforms and visionary city planning, we are committed to creating lasting value and sustainable growth. With every initiative, we aim to bridge insight and impact—shaping a smarter, more connected world."</span></span></em>\n\n<img src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fwhatwedo70.png?alt=media&token=eb687712-5db2-497f-b1cf-2375e27c1d3a" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);opacity: 0.7;"/>\n\n<span style="color: #8B1538"><span style="font-size: 18px"><span style="font-family: Myriad Pro, sans-serif">\n<strong>AGORA ASSET</strong></span></span></span><br />\nAt AGORA Asset, we combine global perspective with local insight to create investment strategies that drive long-term growth and resilience.\u000bOur team of seasoned professionals manages diversified portfolios across multiple asset classes, delivering performance-driven results for both institutional and individual investors.\u000bWe believe in disciplined risk management, rigorous research, and a commitment to excellence in every investment decision.<br />\n<span style="color: #008000"><strong><span style="font-family: Myriad Pro, sans-serif"><span style="font-size: 18px">AGORA CITY PLAN</span></span></strong></span><br />\nAGORA City Plan is shaping the future of urban development by creating access to the world\'s most dynamic and high-potential regions.\u000bFrom master-planned cities to integrated infrastructure projects, we are committed to designing environments that foster innovation, sustainability, and global connectivity.\u000bOur developments are not just spaces—they are living ecosystems for future economies.<br />\n<span style="color: #800080"><strong><span style="font-size: 18px"><span style="font-family: Myriad Pro, sans-serif">AGORA AI</span></span></strong></span><br />\nAt the forefront of digital transformation, AGORA AI is dedicated to building intelligent, adaptive platforms that bridge the online and offline worlds.\u000bFocusing on the O2O (Online-to-Offline) economy, we develop cutting-edge AI technologies that enhance user experience, optimize operations, and unlock new value for platform-based businesses.\u000bWe envision a smarter, more seamless future—powered by innovation.<br />\n<span style="color: #ff00ff"><strong><span style="font-size: 18px"><span style="font-family: Myriad Pro, sans-serif">AGORA OIL REFINERY</span></span></strong></span><br />\nAs a strategic energy partner, AGORA Oil Refinery plays a vital role in powering Malaysia\'s ambitious growth trajectory.\u000bBy ensuring a stable, efficient fuel supply, we support the expansion of key sectors including aviation, logistics, infrastructure, and hospitality.\u000bDriven by a commitment to sustainability and national development, we are helping to lay the foundation for Malaysia\'s energy-secure future.\n<br /><br /><br /><br />\n',
      subContent: 'From emerging markets to established economies, we identify and capitalize on opportunities that others overlook, creating value through strategic partnerships and disciplined execution.',
      footer: 'Investment Excellence Since 2020',
      personName: 'Sarah M. Chen',
      personTitle: 'Chief Investment Officer',
      personImage: null,
      mainContent_style: {
        bold: false,
        italic: false,
        underline: false,
        color: '#333333',
        fontSize: '16px',
        fontFamily: 'inherit'
      }
    },
    itp: {
      title: 'ITP & capital market',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg1.jpg?alt=media&token=3cc87cd8-8ff3-461a-a56b-072e33a7455a',
      mainTitle: '<span style="font-family: Myriad Pro, sans-serif">MAXIMIZING RETURNS THROUGH STRUCTURED PRECISION</span>',
      mainContent: '\n<em><p style="line-height: 1.4; font-size: 22px;"><span style="font-family: Arno Pro Display, serif">"In an environment marked by uncertainty and volatility, ITP offers a uniquely structured approach that prioritizes capital preservation while delivering consistent, high-yield performance. Through disciplined execution and predefined trade frameworks, investors gain access to a reliable, low-risk investment strategy designed for today\'s complex markets."</span></span></em>\n\n<img src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fagora-core-vision%20copy.jpg?alt=media&token=ed312aea-168d-456b-9732-4a16ffe85efd" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />\n\n<span style="color: #1f3038"><span style="font-size: 14px"><span style="font-family: Myriad Pro, sans-serif">\n<span style="font-size: 18px"><strong><span style="color: #008000">Global Capital Market Overview</span></strong><br />\n\nDespite short-term uncertainties, global capital markets continue to offer substantial opportunities for sophisticated investors seeking higher returns and diversification.<br />\n\n<strong><span style="color: #8B1538">Key Market Trends Supporting ITP Viability:</span></strong>\n<br />•\t<strong>Record Liquidity Among Institutions</strong>\nMajor central banks have maintained relatively accommodative liquidity policies to stimulate economic growth, ensuring deep capital pools and demand for yield-enhancing opportunities such as ITPs.\n<br />•\t<strong>Low-Yield Environment in Traditional Assets</strong>\nBond yields in developed markets remain historically low. As a result, institutional investors are increasingly turning to private, structured, and arbitrage-based opportunities to meet return objectives.\n<br />•\t<strong>Strong Demand for Alternative Investment Vehicles</strong>\nThe global alternatives market—including private equity, hedge funds, and structured programs like ITP—is projected to grow to $23.3 trillion by 2026 (Source: Preqin), reflecting rising institutional confidence in these vehicles.\n<br />•\t<strong>De-Risked Arbitrage Structure</strong>\nIn uncertain market conditions, investors prefer mechanisms that offer contractual profit guarantees and asset-backed structures, like the pre-arranged arbitrage model used in ITPs. The no-loss policy and capital protection elements are particularly attractive amid volatility.\n<br />•\t<strong>Tightening Bank Regulations Driving Institutional Interest</strong>\nBasel III and other global regulations have made traditional leverage and interbank trading less flexible, pushing capital into off-balance sheet, collateralized trades such as those facilitated by reputable ITP platforms.\n<br />\n\n<img src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2FKorea-finfncial-asset-size%20copy.jpg?alt=media&token=021d167b-641e-4141-bc04-7daf66737ed7" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />\n\n<strong>Strategic Advantage of ITP in the Current Market</strong><br />\n\nWith its capital efficiency, guaranteed exit strategy, and high-yield potential, the ITP model is exceptionally well-positioned to serve sovereign funds, family offices, and private wealth clients seeking low-risk, high-return alternatives.<br />\nBy participating in an ITP, investors are leveraging an ecosystem that functions independently of public market fluctuations, yet benefits from the very structure and liquidity of the global banking system.<br />\n\n<strong>Instrument Trade Program (ITP) Overview</strong><br />\nThe Instrument Trade Program (ITP) refers to a private, non-public investment strategy that leverages the controlled trade of high-value financial instruments—typically investment-grade bank debentures—in order to generate high-yield returns. These programs are not advertised to the public and are commonly accessible only to institutional or ultra-high-net-worth investors.\n<br /><br />\n<strong><span style="font-size: 18px"><span style="color: #8B1538">Key Highlights</span></span></strong>\n<br />•\t<strong>Minimum Investment Requirement: </strong>USD 100 million\n<br />•\t<strong>Trade Unit Size: </strong>USD 100 million per unit\n<br />•\t<strong>Expected Yield:</strong> Historically reported returns range between 80% and 400% annually\n<br />•\t<strong>Trade Frequency:</strong> Minimum of once per day or week, typically over a 40-week trading year\n<br />•\t<strong>Per-Trade Profit: </strong>Minimum of 2% per trade, with no recorded net losses due to pre-arranged contracts\n<br />\n<strong><span style="color: #8B1538">How the Program Works</span></strong>\n<br />The ITP operates through what is often called a Managed Bank Instrument Trading Platform, involving pre-negotiated purchase and sale agreements for bank-issued debt instruments.\n<br /><strong>Structure & Execution</strong>\n<br />•\t<strong>Pre-arranged Buyers and Sellers: </strong>The trading platform secures both the supply (seller) of instruments and the "exit buyer" in advance, with all pricing and terms contractually locked in.\n<br />•\t<strong>Arbitrage-Based Model: </strong>Instruments are purchased at a discount and resold at a higher, predetermined price, securing a fixed profit margin.\n<br />•\t<strong>Zero-Loss Policy: </strong>Due to these contractual safeguards, each completed trade guarantees a profit and eliminates the possibility of a loss.\n<br />\n<strong>Trader Operations & Credit Line</strong>\n<br />•\t<strong>Non-Depleting Line of Credit: </strong>Trades are conducted using a tradeable line-of-credit established in the client\'s name—not the trader\'s own assets.\n<br />•\t<strong>Bank-Capitalized Credit: </strong>These lines are supported by top-tier commercial banks and require fully verified collateral under strict custody and control protocols.\n<br />•\t<strong>Compliance & Procedures:</strong> Participating clients must adhere to the platform\'s stringent due diligence and compliance standards to meet the issuing bank\'s requirements.\n<br />\n<strong><span style="color: #8B1538">Important Notice</span></strong>\n<br />\n<strong>DISCLAIMER:</strong><br />\n<em>All projected trade returns are hypothetical models and not a guarantee of actual results. Trades are executed on a best-efforts basis, and returns are subject to factors such as market liquidity, supply of instruments, and evolving regulatory conditions.</em>\n<br /><br /><br /><br /></span></span></span></span></span>',
      subContent: 'Through strategic capital market operations, we facilitate seamless access to global liquidity while maintaining the highest standards of regulatory compliance and risk management.',
      footer: 'Technology Innovation Since 2020',
      personName: 'Michael R. Thompson',
      personTitle: 'Chief Technology Officer',
      personImage: null,
      mainTitle_style: {
        bold: true,
        italic: false,
        underline: false,
        color: '#8B1538',
        fontSize: '20px',
        fontFamily: 'inherit'
      },
      mainContent_style: {
        bold: false,
        italic: false,
        underline: false,
        color: '#333333',
        fontSize: '16px',
        fontFamily: 'inherit'
      }
    },
    redevelopment: {
      title: 'R.E. development',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg1.jpg?alt=media&token=3cc87cd8-8ff3-461a-a56b-072e33a7455a',
      mainTitle: 'FROM VISION TO LANDMARK: Cities Reimagined',
      mainContent: '<br /><p style="line-height: 1.4; font-size: 24px;"><em><span style="font-family: Arno Pro Display, serif">"Our real estate vision extends beyond construction—we create world-class destinations that inspire lifestyle, elevate culture, and define tomorrow\'s urban identity. From luxury resorts to future-ready smart cities, each project is built with a commitment to environmental harmony, global connectivity, and enduring value. As a trusted partner for international investors, we shape iconic landscapes that stand the test of time."</span></em></span>\n\n<img src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fcity.jpg?alt=media&token=7a062c20-d616-41cf-a1dd-5e9f25b52fab" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />\n\n<p style="line-height: 1.6; font-size: 14px; font-family: \'Myriad Pro\', sans-serif;">\n  <span style="color: #0000ff;"><strong><span style="font-size: 18px">1. Smart Cities </span></strong></span></span></strong></span><br />\n<strong><em><span style="font-size: 18px"><span style="font-family: Arno Pro Display, serif">"Intelligent Cities, Designed for Tomorrow"</span></span></em></strong><br />\nWe lead the next evolution of urban living through integrated smart city development. By combining digital infrastructure, sustainable design, and mobility innovation, we create intelligent environments where people, technology, and opportunity connect seamlessly.\nOur smart cities are not only efficient—they are livable, resilient, and ready for the future.\n<br />\n<span style="color: #008000"><strong><strong><span style="font-size: 18px">2. Luxury Resorts</span></strong></strong></span><br />\n<span style="font-size: 18px"><span style="font-family: Arno Pro Display, serif"><strong><em>"Where Nature Meets Sophisticated Escape"</em></strong></span></span><br />\nOur resort developments redefine luxury through immersive experiences, exceptional design, and world-class hospitality. From coastal retreats to mountain sanctuaries, each destination is crafted to celebrate its natural surroundings while offering unparalleled comfort and exclusivity.\nWe don\'t just build resorts—we create sanctuaries of refinement, wellness, and cultural elegance.\n<br />\n<span style="font-size: 18px"><span style="font-family: Myriad Pro, sans-serif"><span style="color: #800000"><strong>3. Integrated Urban Developments</strong></span></span></span><br />\n<strong><em><span style="font-size: 18px"><span style="font-family: Arno Pro Display, serif">"Master-Planned Ecosystems for Future Growth"</span></span></em></strong><br />\nWe develop large-scale, mixed-use cities that integrate residential, commercial, cultural, and infrastructure elements into one unified vision.\nDesigned with long-term economic and social impact in mind, our integrated developments are vibrant ecosystems that support sustainable living, business innovation, and inclusive community life.\n<br /><br />\n\n<span style="color: #800000"><strong><span style="font-size: 24px"><span style="font-family: Myriad Pro, sans-serif">KOREA Project</span></span></strong></span>\n<img src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2FKorea-welcomes%20copy.jpg?alt=media&token=2c05212a-83d2-434d-923b-fa92602b6277" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />\n\n<em><strong><span style="font-family: Arno Pro Display, serif"><span style="font-size: 22px">Investing in the Future of Asia\'s Most Dynamic Market</span></span></strong></em><br />\nAgora Asset is leading the development of world-class smart cities, luxury resorts, senior wellness communities, and K-culture entertainment hubs across South Korea. These iconic projects blend advanced infrastructure with cultural innovation—positioning Korea as a global destination for living, leisure, and investment.\nBy combining local insight with global standards, we are creating high-impact developments that drive long-term value, attract international tourism, and unlock new economic potential. For visionary investors, Korea is not just a market—it\'s the next frontier.\n<br /><br />\n<span style="color: #800000"><strong><span style="font-size: 18px"><span style="font-family: Myriad Pro, sans-serif">Indonesia Smart Growth Initiative</span></span></strong></span><br />\n\n<img src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2FNew%20Capital%20city%20Indonesia%20web%201-1.png?alt=media&token=9077ae06-d038-443d-9ab7-896ae6a0321b" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />\n\n<strong><span style="font-size: 22px"><em><span style="font-family: Arno Pro Display, serif">Pioneering Sustainable Cities for a Changing Climate</span></span><br /></strong></em>\nAs Indonesia responds to climate change with bold urban planning, Agora Asset is contributing to the development of next-generation smart cities and integrated resort destinations in key relocation zones.\nOur projects combine resilient infrastructure, eco-conscious design, and technology-driven solutions to support Indonesia\'s vision for sustainable urban growth. By partnering on climate-adaptive developments, Agora Asset is helping shape a future-ready ecosystem that promotes environmental harmony, economic opportunity, and regional transformation.\nFor investors, this represents a unique gateway into Southeast Asia\'s most ambitious urban transition.\n<br />\n<img src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fnewcity7.png?alt=media&token=91bffd22-9d72-49bf-a5bc-555619e1b162" alt="삽입된 이미지" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" />\n<br /><br /><br /><br />',
      subContent: 'From luxury residential complexes to cutting-edge commercial spaces, we transform visions into reality while maximizing long-term value for investors and communities alike.',
      footer: 'Development Excellence Since 2020',
      personName: 'Jennifer L. Park',
      personTitle: 'Head of Real Estate',
      personImage: null,
      mainContent_style: {
        bold: false,
        italic: false,
        underline: false,
        color: '#333333',
        fontSize: '16px',
        fontFamily: 'inherit'
      },
      mainTitle_style: {
        bold: true,
        italic: false,
        underline: false,
        color: '#8B1538',
        fontSize: '20px',
        fontFamily: 'inherit'
      }
    },
    announcement: {
      title: 'announcement',
      bgImage: 'https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fsection-bg1.jpg?alt=media&token=3cc87cd8-8ff3-461a-a56b-072e33a7455a',
      mainTitle: 'LATEST NEWS & ANNOUNCEMENTS',
      mainContent: '<em><p style="line-height: 1.4; font-size: 22px;"><span style="font-family: Arno Pro Display, serif">Stay informed about our latest developments, strategic partnerships, and market insights. \nWe regularly share updates on our investment activities and industry perspectives.</span></span></em>\n\n<em><strong><span style="font-size: 20px"><span style="font-family: Myriad Pro, sans-serif"><span style="color: #800000">Achievements</span>\n</span></span></strong></em>\n<span style="font-size: 14px"><span style="font-family: Myriad Pro, sans-serif"><strong><span style="font-family: Myriad Pro, sans-serif">2025. 04.\tMOU for 50M USD investment from AMC, Indonesia\n2025. 03.\tMOU for 5B Euro investments from Aventulo, Germany\n2020. 06.\tInvestment contract with Chase Financial Group for USD 10B\n2020. 05.\tPre-report and approve the loan contract for money to Euro 5B Ministary of Strategy and Finance\n2019. 12.\tMOA sign up with ETNIK WAJA ADN. BHD & Agora asset Ltd. for PIPC, Johore Malaysia\n2019. 02.\tEstablished Agora Asset Ltd. Korea\n2018. 10.\tMOU with Marriot & PT Bali Unicor Indonesia Bali Hotel\n2018. 09.\tEstablished PT Bali Unicor Indonesia\n2015. 10\tPT Unicor Inc. Indonesia Corporation establishment\n2015. 07.\tNusa Penida Island development join venture contract in Bali\n2012. 03.\tHangang CINEPOLIS Investment briefing session and site confirmation\n2012. 02.\tMOU with Gimpo-si to attract 6B USD in foreign capital\n2008. 08. \tEstablished Unicor Inc. Korea\n2006. 10.\tEstablished Unicor Inc. USA\n</span></strong></span></span><br /><br /><br /><br />',
      subContent: 'Our commitment to transparency ensures that stakeholders are always informed about significant developments and opportunities within our organization.',
      footer: 'News & Updates 2024',
      personName: 'Robert K. Wilson',
      personTitle: 'Head of Communications',
      personImage: null,
      mainContent_style: {
        bold: false,
        italic: false,
        underline: false,
        color: '#333333',
        fontSize: '16px',
        fontFamily: 'inherit'
      }
    }
  };

  // localStorage에서 데이터를 동기적으로 불러오는 함수
  const getInitialSectionData = () => {
    try {
      const savedData = localStorage.getItem('agoraAssetSectionData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('초기 로드: localStorage에서 불러온 데이터:', parsedData);
        return parsedData;
      } else {
        console.log('초기 로드: 저장된 데이터가 없어 기본값 사용');
        return defaultSectionData;
      }
    } catch (error) {
      console.error('초기 데이터 불러오기 실패:', error);
      return defaultSectionData;
    }
  };

  // localStorage 방식으로 섹션 데이터 관리 (안정성 우선)
  const [sectionData, setSectionData] = useState(getInitialSectionData);

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

  // localStorage에서 뉴스 데이터를 동기적으로 불러오는 함수
  const getInitialNewsData = () => {
    try {
      const savedNews = localStorage.getItem('agoraAssetNewsData');
      if (savedNews) {
        const parsedNews = JSON.parse(savedNews);
        console.log('초기 로드: localStorage에서 불러온 뉴스 데이터:', parsedNews);
        return parsedNews;
      } else {
        console.log('초기 로드: 저장된 뉴스 데이터가 없어 기본값 사용');
        return defaultNewsItems;
      }
    } catch (error) {
      console.error('초기 뉴스 데이터 불러오기 실패:', error);
      return defaultNewsItems;
    }
  };

  // localStorage 방식으로 뉴스 데이터 관리 (안정성 우선)
  const [newsItems, setNewsItems] = useState(getInitialNewsData);

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
    console.log('updateContent 호출:', { sectionId, field, value });
    
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
        console.log('localStorage에 저장 완료:', newData);
        
        // 저장 확인을 위한 검증
        const savedCheck = localStorage.getItem('agoraAssetSectionData');
        if (savedCheck) {
          console.log('저장 검증 성공:', JSON.parse(savedCheck));
        }
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

  // 데이터 내보내기 함수들 추가
  const exportData = useCallback(() => {
    try {
      const sectionData = localStorage.getItem('agoraAssetSectionData');
      const newsData = localStorage.getItem('agoraAssetNewsData');
      
      // 디버깅을 위한 로그 출력
      console.log('=== localStorage 디버깅 ===');
      console.log('sectionData raw:', sectionData);
      console.log('newsData raw:', newsData);
      console.log('현재 sectionData state:', sectionData);
      console.log('현재 newsItems state:', newsItems);
      
      const exportObj = {
        timestamp: new Date().toISOString(),
        sectionData: sectionData ? JSON.parse(sectionData) : null,
        newsData: newsData ? JSON.parse(newsData) : null,
        // 현재 state도 함께 포함
        currentStateData: {
          sectionData: sectionData,
          newsItems: newsItems
        }
      };
      
      console.log('최종 export 객체:', exportObj);
      
      return JSON.stringify(exportObj, null, 2);
    } catch (error) {
      console.error('데이터 내보내기 실패:', error);
      return null;
    }
  }, [sectionData, newsItems]);

  const copyDataToClipboard = useCallback(() => {
    const data = exportData();
    if (data) {
      navigator.clipboard.writeText(data).then(() => {
        alert('📋 편집 데이터가 클립보드에 복사되었습니다!\n\n이 데이터를 개발자에게 전달하여 실제 코드에 반영할 수 있습니다.');
      }).catch(err => {
        console.error('클립보드 복사 실패:', err);
        // 클립보드 API가 실패하면 수동으로 선택할 수 있는 모달 표시
        showDataModalFunc(data);
      });
    } else {
      alert('❌ 데이터 내보내기에 실패했습니다.');
    }
  }, [exportData]);

  const downloadData = useCallback(() => {
    const data = exportData();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `agora-asset-data-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('💾 편집 데이터가 다운로드되었습니다!\n\n이 파일을 개발자에게 전달하여 실제 코드에 반영할 수 있습니다.');
    } else {
      alert('❌데이터 다운로드에 실패했습니다.');
    }
  }, [exportData]);

  const [showDataModal, setShowDataModal] = useState(false);
  const [modalData, setModalData] = useState('');

  const showDataModalFunc = useCallback((data) => {
    setModalData(data);
    setShowDataModal(true);
  }, []);

  // localStorage 강제 저장 함수 추가
  const forceSaveToLocalStorage = useCallback(() => {
    try {
      // 현재 state를 localStorage에 강제 저장
      localStorage.setItem('agoraAssetSectionData', JSON.stringify(sectionData));
      localStorage.setItem('agoraAssetNewsData', JSON.stringify(newsItems));
      
      console.log('강제 저장 완료!');
      console.log('저장된 sectionData:', sectionData);
      console.log('저장된 newsItems:', newsItems);
      
      alert('✅ 현재 상태가 localStorage에 강제 저장되었습니다!\n이제 다시 다운로드해보세요.');
    } catch (error) {
      console.error('강제 저장 실패:', error);
      alert('❌ 강제 저장에 실패했습니다.');
    }
  }, [sectionData, newsItems]);

  // localStorage 디버그 함수 추가
  const debugLocalStorage = useCallback(() => {
    try {
      const sectionDataRaw = localStorage.getItem('agoraAssetSectionData');
      const newsDataRaw = localStorage.getItem('agoraAssetNewsData');
      
      console.log('=== localStorage 디버그 ===');
      console.log('localStorage sectionData:', sectionDataRaw);
      console.log('localStorage newsData:', newsDataRaw);
      console.log('현재 state sectionData:', sectionData);
      console.log('현재 state newsItems:', newsItems);
      
      // localStorage의 모든 키 확인
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allKeys.push({
          key: key,
          value: localStorage.getItem(key),
          size: localStorage.getItem(key)?.length || 0
        });
      }
      
      console.log('=== localStorage 전체 키 목록 ===');
      console.log(allKeys);
      
      const debugInfo = `
📊 localStorage 고급 디버그 정보:

🔍 기본 키 확인:
- agoraAssetSectionData: ${sectionDataRaw ? '있음' : '없음'} (${sectionDataRaw ? sectionDataRaw.length : 0}자)
- agoraAssetNewsData: ${newsDataRaw ? '있음' : '없음'} (${newsDataRaw ? newsDataRaw.length : 0}자)

🔍 현재 브라우저 state:
- sectionData 섹션 수: ${Object.keys(sectionData).length}개
- newsItems 뉴스 수: ${newsItems.length}개

🔍 localStorage 전체 키 목록:
${allKeys.map(item => `- ${item.key}: ${item.size}자`).join('\n')}

💡 혹시 다른 키에 데이터가 저장되어 있나요?
브라우저 개발자도구(F12) → Console 탭에서 더 자세한 정보를 확인하세요!

${!sectionDataRaw || !newsDataRaw ? '⚠️ 기본 키에 데이터가 없습니다!' : '✅ 기본 키에 데이터가 있습니다.'}
      `;
      
      alert(debugInfo);
         } catch (error) {
       console.error('디버그 실패:', error);
       alert('❌ 디버그에 실패했습니다.');
     }
   }, [sectionData, newsItems]);

   // DOM에서 실제 데이터 추출 함수 추가
   const extractRealDataFromDOM = useCallback(() => {
     try {
       // DOM에서 실제로 표시되는 텍스트들을 추출
       const realData = {
         timestamp: new Date().toISOString(),
         note: "DOM에서 직접 추출한 실제 표시 데이터",
         extractedData: {}
       };

       // 현재 페이지의 모든 텍스트 내용 추출
       const allTextElements = document.querySelectorAll('h1, h2, h3, p, div');
       const extractedTexts = [];
       
       allTextElements.forEach((element, index) => {
         const text = element.innerText || element.textContent;
         if (text && text.trim().length > 10) { // 의미있는 텍스트만
           extractedTexts.push({
             index: index,
             tagName: element.tagName,
             text: text.trim(),
             className: element.className || ''
           });
         }
       });

       realData.extractedData = {
         totalElements: extractedTexts.length,
         texts: extractedTexts.slice(0, 50) // 처음 50개만
       };

       console.log('=== DOM에서 추출한 실제 데이터 ===');
       console.log(realData);

       const jsonData = JSON.stringify(realData, null, 2);
       
       // 클립보드 복사 시도
       if (navigator.clipboard && navigator.clipboard.writeText) {
         navigator.clipboard.writeText(jsonData).then(() => {
           alert(`📋 DOM에서 추출한 실제 데이터가 클립보드에 복사되었습니다!
           
🔍 추출된 요소 수: ${extractedTexts.length}개
💾 데이터 크기: ${jsonData.length}자

이 데이터가 실제 브라우저에서 보이는 완성본입니다!`);
         }).catch(err => {
           console.error('클립보드 복사 실패:', err);
           // 클립보드 실패시 모달로 표시
           setModalData(jsonData);
           setShowDataModal(true);
           alert('클립보드 복사에 실패했습니다. 모달창에서 수동으로 복사해주세요!');
         });
       } else {
         // 클립보드 API가 없으면 바로 모달 표시
         setModalData(jsonData);
         setShowDataModal(true);
         alert('클립보드를 사용할 수 없습니다. 모달창에서 수동으로 복사해주세요!');
       }

     } catch (error) {
       console.error('DOM 데이터 추출 실패:', error);
       alert('❌ DOM 데이터 추출에 실패했습니다.');
     }
   }, []);

   // 간단한 텍스트 데이터 표시 함수
   const showSimpleTextData = useCallback(() => {
     try {
       console.log('=== 간단한 텍스트 데이터 추출 ===');
       
       // 현재 페이지의 주요 텍스트만 추출
       const titles = Array.from(document.querySelectorAll('h1, h2')).map(el => el.textContent?.trim()).filter(Boolean);
       const paragraphs = Array.from(document.querySelectorAll('p')).map(el => el.textContent?.trim()).filter(Boolean);
       
       const simpleData = {
         titles: titles,
         paragraphs: paragraphs.slice(0, 20), // 처음 20개 문단만
         totalTitles: titles.length,
         totalParagraphs: paragraphs.length
       };
       
       console.log('제목들:', titles);
       console.log('문단들:', paragraphs);
       console.log('전체 데이터:', simpleData);
       
       const textData = `
=== AGORA ASSET 웹사이트 실제 데이터 ===

📋 제목 목록 (${titles.length}개):
${titles.map((title, i) => `${i+1}. ${title}`).join('\n')}

📝 문단 내용 (${paragraphs.length}개 중 처음 20개):
${paragraphs.slice(0, 20).map((para, i) => `${i+1}. ${para.substring(0, 200)}...`).join('\n\n')}

=== 데이터 요약 ===
- 총 제목 수: ${titles.length}개
- 총 문단 수: ${paragraphs.length}개
- 추출 시간: ${new Date().toLocaleString()}
       `;
       
       // 모달에 표시
       setModalData(textData);
       setShowDataModal(true);
       
       alert(`📊 간단한 텍스트 데이터를 추출했습니다!

🔍 제목: ${titles.length}개
📝 문단: ${paragraphs.length}개

모달창에서 데이터를 확인하고 복사하세요!`);
       
     } catch (error) {
       console.error('간단한 데이터 추출 실패:', error);
       alert('❌ 데이터 추출에 실패했습니다.');
     }
   }, []);

   // 완전한 데이터 리셋 및 재구축 함수
   const resetAndRebuildData = useCallback(() => {
     try {
       // localStorage 완전 초기화
       localStorage.removeItem('agoraAssetSectionData');
       localStorage.removeItem('agoraAssetNewsData');
       
       // 현재 state를 기본값으로 리셋
       setSectionData(defaultSectionData);
       setNewsItems(defaultNewsItems);
       
       alert('✅ 데이터가 초기화되었습니다!\n페이지를 새로고침한 후 다시 편집해주세요.');
       
       // 페이지 새로고침
       window.location.reload();
     } catch (error) {
       console.error('데이터 리셋 실패:', error);
       alert('❌ 데이터 리셋에 실패했습니다.');
     }
   }, []);

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

      // 편집 모드가 아닐 때 content 변경사항을 즉시 반영
      useEffect(() => {
        if (!isEditing) {
          setLocalEditValue(content || '');
        }
      }, [content, isEditing]);

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
        console.log('handleSave 호출:', { field, localEditValue, localCurrentStyle });
        
        // 단순히 현재 편집 중인 텍스트를 저장
        handleTextEdit(field, localEditValue);
        
        // 스타일 정보도 함께 저장
        const styleField = `${field}_style`;
        handleTextEdit(styleField, localCurrentStyle);
        
        setIsEditing(false);
        setLocalShowToolbar(false);
        setShowColorPicker(false);
        
        // 저장 완료 알림
        console.log('저장 완료!');
        alert('저장되었습니다!');
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
              marginBottom: window.innerWidth <= 768 ? '40px' : '80px',
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(-30px)',
              transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%',
              maxWidth: '1000px',
              padding: window.innerWidth <= 768 ? '0 30px' : '0 60px'
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
              padding: window.innerWidth <= 768 ? '0 30px' : '0 100px'
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
                   padding: window.innerWidth <= 768 ? '0 0px' : '0 40px'
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
                   padding: window.innerWidth <= 768 ? '0 0px' : '0 40px'
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
            marginBottom: window.innerWidth <= 768 ? '40px' : '80px',
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(-30px)',
            transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%',
            maxWidth: '1000px',
            padding: window.innerWidth <= 768 ? '0 30px' : '0 60px'
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
            padding: window.innerWidth <= 768 ? '0 30px' : '0 100px'
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
                padding: window.innerWidth <= 768 ? '0 0px' : '0 40px'
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
                padding: window.innerWidth <= 768 ? '0 0px' : '0 40px'
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
          gap: '10px',
          flexWrap: 'wrap'
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
          
          {/* 데이터 내보내기 버튼들 - 관리자만 표시 */}
          {isAdmin && (
            <>
              <button
                onClick={debugLocalStorage}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#F59E0B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                title="localStorage 상태 확인"
              >
                🔍 디버그
              </button>
              
              <button
                onClick={forceSaveToLocalStorage}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                title="현재 상태를 localStorage에 강제 저장"
              >
                💾 강제저장
              </button>
              
              <button
                onClick={extractRealDataFromDOM}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                title="DOM에서 실제 표시 데이터 추출"
              >
                🎯 실제데이터
              </button>
              
              <button
                onClick={showSimpleTextData}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                title="간단한 텍스트 데이터 추출"
              >
                📝 간단추출
              </button>
              
              <button
                onClick={resetAndRebuildData}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6B7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                title="데이터 초기화 후 재시작"
              >
                🔄 리셋
              </button>
              
              <button
                onClick={copyDataToClipboard}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#7C3AED',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                title="편집한 데이터를 클립보드에 복사"
              >
                📋 복사
              </button>
              
              <button
                onClick={downloadData}
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
                title="편집한 데이터를 파일로 다운로드"
              >
                💾 다운로드
              </button>
            </>
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
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            minWidth: '400px',
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

      {/* 데이터 표시 모달 */}
      {showDataModal && (
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
          zIndex: 10001,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            maxWidth: '80vw',
            maxHeight: '80vh',
            overflow: 'auto',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#fff',
              marginBottom: '20px',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              📋 편집 데이터 복사
            </h2>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              아래 데이터를 전체 선택(Ctrl+A)하고 복사(Ctrl+C)하세요:
            </p>
            
            <textarea
              value={modalData}
              readOnly
              style={{
                width: '100%',
                height: '300px',
                padding: '15px',
                fontSize: '12px',
                fontFamily: 'monospace',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              onClick={(e) => e.target.select()}
            />
            
            <div style={{
              marginTop: '20px',
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(modalData).then(() => {
                    alert('클립보드에 복사되었습니다!');
                    setShowDataModal(false);
                  });
                }}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#7C3AED',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                📋 클립보드에 복사
              </button>
              
              <button
                onClick={() => setShowDataModal(false)}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                닫기
              </button>
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