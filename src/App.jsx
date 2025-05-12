import { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { message } from 'antd';
import RandevuAl from './components/RandevuAl';
import Randevularim from './components/Randevularim';
import axios from 'axios';
import logo from './assets/Medivite.png';

message.config({
  top: 24,
  duration: 2,
  maxCount: 3,
  getContainer: () => document.getElementById('root') // root'a ekle
});

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  const handleLogout = () => {
    setUser(null);
    setPage('dashboard');
    message.info('Çıkış yapıldı.');
  };

  // Logo her zaman görünür olacak şekilde en üstte
  const logoElement = (
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
  );

  if (!user) {
    return (
      <>
        {logoElement}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#222',
          zIndex: 9999
        }}>
          <LoginForm onLogin={setUser} />
        </div>
      </>
    );
  }

  if (page === 'randevuAl') {
    return (
      <>
        {logoElement}
        <RandevuAl user={user} onBack={() => setPage('dashboard')} />
      </>
    );
  }

  if (page === 'randevularim') {
    return (
      <>
        {logoElement}
        <Randevularim user={user} onBack={() => setPage('dashboard')} />
      </>
    );
  }

  return (
    <>
      {logoElement}
      <Dashboard user={user} onSelect={setPage} onLogout={handleLogout} />
    </>
  );
}

export default App;
