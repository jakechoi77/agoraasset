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

      {/* Logo - Much Smaller */}
      <div 
        id="agora-logo-container"
        style={{
          position: 'absolute',
          top: '50px',
          left: '120px',
          zIndex: 20,
          height: '110px',
          width: 'auto'
        }}
      >
        <img 
          id="agora-logo"
          src="https://firebasestorage.googleapis.com/v0/b/doers-48e75.firebasestorage.app/o/agora%2Fagora-logo-y.png?alt=media&token=cf92ac15-d0a3-4a76-a81e-4b2dcd0210bb"
          alt="AGORA ASSET"
          style={{ 
            height: '110px',
            width: 'auto',
            maxHeight: '110px',
            display: 'block'
          }}
        />
      </div>

      {/* Main Text Box */}
      <div 
        style={{
          position: 'absolute',
          bottom: '60px',
          right: '0px',
          width: '680px',
          backgroundColor: 'rgba(64, 64, 64, 0.3)',
          padding: '90px 120px 180px 90px',
          backdropFilter: 'blur(4px)',
          zIndex: 15
        }}
      >
        <h1 style={{
          fontSize: '2.46rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '1.34rem',
          lineHeight: '1.2',
          textAlign: 'left'
        }}>
          We possess the <span style={{ fontStyle: 'italic' }}>vision</span> to{' '}
          <span style={{ color: '#DAA520', fontStyle: 'italic' }}>redefine the future</span>.
        </h1>
        
        <p style={{
          fontSize: '1.12rem',
          color: '#fff',
          marginBottom: '1.12rem',
          fontWeight: '500'
        }}>
          We don't follow markets—we create them.
        </p>
        
        <p style={{
          fontSize: '1.01rem',
          color: '#fff',
          marginBottom: '1.12rem',
          lineHeight: '1.5'
        }}>
          Our global expertise spans international finance, strategic investments, 
          visionary urban development, and revolutionary AI investments.
        </p>
        
        <p style={{
          fontSize: '1.01rem',
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
        bottom: '380px',
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
              key={section.id}
              style={{
                opacity: menuVisible ? 1 : 0,
                transform: menuVisible ? 'translateX(0px)' : 'translateX(30px)',
                transition: `all 0.6s ease-out ${index * 0.2}s`
              }}
            >
              <button
                onClick={() => setCurrentPage(section.id)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  cursor: 'pointer',
                  outline: 'none',
                  padding: '16px 32px',
                  width: '380px',
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