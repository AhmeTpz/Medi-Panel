import { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { message } from 'antd';
import RandevuAl from './components/RandevuAl';
import Randevularim from './components/Randevularim';
import axios from 'axios';
import logo from './assets/Medivite.png';
import background from './assets/background.jpg';
import background2 from './assets/background2.jpg';

message.config({
  top: 24,
  duration: 2,
  maxCount: 3,
  getContainer: () => document.getElementById('root')
});

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  const handleLogout = () => {
    setUser(null);
    setPage('dashboard');
    message.info('Çıkış yapıldı.');
  };

  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${background2})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: -1,
  };

  if (!user) {
    const loginLogoElement = (
      <img
        src={logo}
        alt="Medivite Logo"
        style={{
          position: 'absolute',
          top: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 'auto',
          zIndex: 10000,
        }}
      />
    );

    return (
      <>
        {loginLogoElement}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 9999,
        }}>
          <LoginForm onLogin={setUser} />
        </div>
      </>
    );
  }

  return (
    <>
      <div style={backgroundStyle}></div>
      {page === 'dashboard' ? (
        <img
          src={logo}
          alt="Medivite Logo"
          style={{
            position: 'absolute',
            top: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 200,
            height: 'auto',
            zIndex: 10000,
          }}
        />
      ) : (
        <img
          src={logo}
          alt="Medivite Logo"
          style={{
            position: 'fixed',
            top: 40,
            left: 60,
            width: 200,
            height: 'auto',
            zIndex: 10000,
          }}
        />
      )}
      {page === 'dashboard' ? (
        <Dashboard user={user} onSelect={setPage} onLogout={handleLogout} />
      ) : page === 'randevuAl' ? (
        <RandevuAl user={user} onBack={() => setPage('dashboard')} />
      ) : (
        <Randevularim user={user} onBack={() => setPage('dashboard')} />
      )}
    </>
  );
}

export default App;
