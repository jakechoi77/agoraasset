import React from 'react';

const MainPage = ({ sections, setCurrentPage, menuVisible }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#000'
      }}
    >
      {/* Background Image with Zoom Animation */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fagora-hero30.jpg?alt=media&token=a0b4996d-9506-44ec-8c2b-3a31d1f22c68")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          animation: 'slowZoom 10s ease-in-out forwards'
        }}
      />

      {/* Logo - Responsive Size */}
      <div 
        id="agora-logo-container"
        style={{
          position: 'absolute',
          top: window.innerWidth <= 768 ? '20px' : '50px',
          left: window.innerWidth <= 768 ? '20px' : '120px',
          zIndex: 20,
          height: window.innerWidth <= 768 ? '60px' : '110px',
          width: 'auto'
        }}
      >
        <img 
          id="agora-logo"
          src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fagora-logo-y.png?alt=media&token=cf92ac15-d0a3-4a76-a81e-4b2dcd0210bb"
          alt="AGORA ASSET"
          style={{ 
            height: window.innerWidth <= 768 ? '60px' : '110px',
            width: 'auto',
            maxHeight: window.innerWidth <= 768 ? '60px' : '110px',
            display: 'block'
          }}
        />
      </div>

      {/* Main Text Box */}
      <div 
        style={{
          position: 'absolute',
          bottom: window.innerWidth <= 768 ? '20px' : '60px',
          right: '0px',
          width: window.innerWidth <= 768 ? '100vw' : '680px',
          backgroundColor: 'rgba(64, 64, 64, 0.3)',
          padding: window.innerWidth <= 768 ? '30px 20px 180px 30px' : '90px 120px 180px 90px',
          backdropFilter: 'blur(2px)',
          zIndex: 15
        }}
      >
        <h1 style={{
          fontSize: window.innerWidth <= 768 ? '1.5rem' : '2.48rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: window.innerWidth <= 768 ? '1rem' : '1.34rem',
          lineHeight: '1.2',
          textAlign: 'left'
        }}>
          We possess the <span style={{ fontStyle: 'italic' }}>vision</span> to{' '}
          <span style={{ color: '#dcaf15', fontStyle: 'italic' }}>redefine the future</span>.
        </h1>
        
        <p style={{
          fontSize: window.innerWidth <= 768 ? '1rem' : '1.12rem',
          color: '#fff',
          marginBottom: window.innerWidth <= 768 ? '0.8rem' : '1.12rem',
          fontWeight: '500'
        }}>
          We don't follow markets—we create them.
        </p>
        
        <p style={{
          fontSize: window.innerWidth <= 768 ? '0.9rem' : '1.01rem',
          color: '#fff',
          marginBottom: window.innerWidth <= 768 ? '0.8rem' : '1.12rem',
          lineHeight: '1.5'
        }}>
          Our global expertise spans international finance, strategic investments, 
          visionary urban development, and revolutionary AI investments.
        </p>
        
        <p style={{
          fontSize: window.innerWidth <= 768 ? '0.9rem' : '1.01rem',
          color: '#fff',
          lineHeight: '1.5',
          marginBottom: '0px'
        }}>
          Built on intellectual rigor. Powered by financial strength. 
          Proven by extraordinary results.<br />
          Where artificial intelligence meets human ambition. Where cities rise and markets evolve.
        </p>
      </div>

      {/* Navigation Menu */}
      <div style={{
        position: 'absolute',
        bottom: window.innerWidth <= 768 ? '250px' : '380px',
        right: '0px',
        zIndex: 20
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          {sections && sections.map((section, index) => (
            <div
              key={`menu-item-${section.id}`}
              className={menuVisible ? `menu-item-${index} animate` : `menu-item-${index}`}
            >
              <button
                onClick={() => setCurrentPage(section.id)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: window.innerWidth <= 768 ? '1rem' : '1.2rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  cursor: 'pointer',
                  outline: 'none',
                  padding: window.innerWidth <= 768 ? '12px 24px' : '16px 32px',
                  width: window.innerWidth <= 768 ? '280px' : '380px',
                  backdropFilter: 'blur(2px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.color = '#991B1B';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                  e.target.style.color = '#DC2626';
                }}
              >
                {section.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation for Zoom Effect */}
      <style>{`
        @keyframes slowZoom {
          0% { 
            transform: scale(0.95);
          }
          100% { 
            transform: scale(1.15);
          }
        }
        
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(80px) scale(0.8);
            filter: blur(3px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px) scale(1);
            filter: blur(0px);
          }
        }
        
        .menu-item-0, .menu-item-1, .menu-item-2, .menu-item-3, .menu-item-4 {
          opacity: 0;
          transform: translateX(80px) scale(0.8);
          filter: blur(3px);
        }
        
        .menu-item-0.animate { animation: slideInFromRight 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both; }
        .menu-item-1.animate { animation: slideInFromRight 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.25s both; }
        .menu-item-2.animate { animation: slideInFromRight 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.4s both; }
        .menu-item-3.animate { animation: slideInFromRight 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.55s both; }
        .menu-item-4.animate { animation: slideInFromRight 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.7s both; }
        
        #agora-logo-container {
          height: 110px !important;
          width: auto !important;
        }
        
        #agora-logo {
          height: 110px !important;
          width: auto !important;
          max-height: 110px !important;
          display: block !important;
        }
      `}</style>
    </div>
  );
};

export default MainPage; 