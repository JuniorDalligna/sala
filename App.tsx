
import React, { useState, useEffect } from 'react';
import { RoomInfo } from './types';
import SetupScreen from './components/SetupScreen';
import RoomDisplay from './components/RoomDisplay';
import Logo from './components/Logo';
import { initMsal, getActiveAccount, login } from './services/microsoftGraph';

const App: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorType, setErrorType] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      await initMsal();
      const account = getActiveAccount();
      setIsAuthenticated(!!account);
      
      const saved = localStorage.getItem('tremea_terminal_config_v2');
      if (saved) {
        try {
          setSelectedRoom(JSON.parse(saved));
        } catch (e) {
          localStorage.removeItem('tremea_terminal_config_v2');
        }
      }
      setReady(true);
    };
    initialize();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorType(null);
    try {
      const account = await login();
      if (account) {
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      setErrorType(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleComplete = (room: RoomInfo) => {
    localStorage.setItem('tremea_terminal_config_v2', JSON.stringify(room));
    setSelectedRoom(room);
  };

  const handleReset = () => {
    if (window.confirm("Redefinir este terminal?")) {
      localStorage.removeItem('tremea_terminal_config_v2');
      window.location.reload();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin);
    alert("URL copiada para a área de transferência!");
  };

  if (!ready) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C5202D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center p-12 text-center overflow-y-auto">
        <Logo className="text-7xl mb-12" variant="white" />
        <h1 className="text-white text-3xl font-black uppercase tracking-tighter mb-4">Painel de Salas</h1>
        <p className="text-zinc-500 max-w-md mb-12">
          Conecte com sua conta Microsoft 365 para gerenciar a ocupação das salas TREMÉA.
        </p>

        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="bg-[#C5202D] hover:bg-[#a31a25] text-white px-12 py-6 rounded-2xl font-black text-xl flex items-center gap-4 transition-all active:scale-95 disabled:opacity-50 mb-12 shadow-2xl shadow-red-900/20"
        >
          {isLoggingIn ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
            </svg>
          )}
          ENTRAR COM MICROSOFT 365
        </button>

        <div className="mt-8 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 w-full max-w-md">
          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mb-3 text-center">Configuração do Azure AD (Redirect URI):</p>
          <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/5">
            <code className="text-emerald-500 text-xs break-all flex-1 text-left font-mono">{window.location.origin}</code>
            <button 
              onClick={copyToClipboard}
              className="text-zinc-400 hover:text-white transition-colors p-1"
              title="Copiar URL"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black select-none">
      {selectedRoom ? (
        <RoomDisplay room={selectedRoom} onReset={handleReset} />
      ) : (
        <SetupScreen onComplete={handleComplete} />
      )}
    </div>
  );
};

export default App;
