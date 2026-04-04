import React, { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Settings, X, Key, ArrowLeft } from 'lucide-react';

export const Header: React.FC = () => {
  const { data } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Token state
  const [githubToken, setGithubToken] = useState('');
  const [isTokenPanelOpen, setIsTokenPanelOpen] = useState(false);
  
  const isDev = location.pathname.includes('/dev');
  const isHome = location.pathname === '/' || location.pathname === '/dev';
  const isMediaKit = location.pathname === '/mediakit';
  
  // Páginas que devem mostrar o botão de voltar
  const showBackButton = !isHome;

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setGithubToken(savedToken);
    }
  }, []);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const scrolled = latest > 30;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    });
  }, [scrollY]);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setGithubToken(newToken);
    localStorage.setItem('github_token', newToken);
  };

  const handleBack = () => {
    // Se estiver em uma rota /dev, volta para /dev, senão volta para /
    if (isDev) {
      navigate('/dev');
    } else {
      navigate('/');
    }
  };

  // Determine target values based on page and scroll state
  const headerHeight = (isHome || isMediaKit) ? (isScrolled ? 100 : 250) : 200;
  
  const wavePath = ((isHome || isMediaKit) && isScrolled) 
    ? "M0,118 Q300,118 600,118 T1200,118 L1200,125 L0,125 Z" 
    : "M0,50 Q300,120 600,50 T1200,50 L1200,125 L0,125 Z";

  const waveHeight = (isHome || isMediaKit) ? 20 : 20;

  const imgConfig = {
    top: (isHome || isMediaKit) ? 64 : 90,
    left: ((isHome || isMediaKit) && isScrolled) ? 24 : '50%',
    x: ((isHome || isMediaKit) && isScrolled) ? 0 : '-50%',
    size: (isHome || isMediaKit) ? (isScrolled ? 50 : 224) : 120,
    borderRadius: (isHome || isMediaKit) ? '160px 160px 0 0' : '100px 100px 0 0'
  };

  return (
    <motion.header 
      initial={false}
      animate={{ height: headerHeight }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1],
        delay: ((isHome || isMediaKit) && !isScrolled) ? 0.1 : 0 
      }}
      className={`${(isHome || isMediaKit) ? 'fixed' : 'absolute'} top-0 left-0 right-0 z-50 bg-magenta bg-pattern`}
    >
      {/* Back Button */}
      {showBackButton && (
        <div className="fixed top-4 left-4 z-[9999] pointer-events-auto">
          <button 
            onClick={handleBack}
            className="bg-white/40 hover:bg-white/60 text-white p-3 rounded-full backdrop-blur-md transition-all active:scale-95 border-2 border-white shadow-2xl hover:shadow-3xl"
            title="Voltar"
            style={{ minWidth: '48px', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      )}

      {/* Dev Mode Settings Button */}
      {isDev && (
        <>
          {/* Overlay escuro quando o painel está aberto */}
          <AnimatePresence>
            {isTokenPanelOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsTokenPanelOpen(false)}
                className="fixed inset-0 bg-black/50 z-[9998] pointer-events-auto"
              />
            )}
          </AnimatePresence>

          <div className={`fixed top-4 ${showBackButton ? 'left-20' : 'left-4'} z-[9999] pointer-events-auto`}>
          <button 
            onClick={() => setIsTokenPanelOpen(!isTokenPanelOpen)}
            className="bg-white/40 hover:bg-white/60 text-white p-3 rounded-full backdrop-blur-md transition-all active:scale-95 border-2 border-white shadow-2xl hover:shadow-3xl"
            title="Configurações de Deploy (Token do GitHub)"
            style={{ minWidth: '48px', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isTokenPanelOpen ? <X size={24} /> : <Settings size={24} />}
          </button>

          <AnimatePresence>
            {isTokenPanelOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute top-16 left-0 w-[300px] z-[10000]"
              >
                <div className="bg-white p-5 rounded-2xl shadow-2xl border-2 border-[#ea92be] flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[#cd3b8c] text-[10px] font-black tracking-wider uppercase">
                    <Key size={12} />
                    <span>GitHub Token de Acesso</span>
                  </div>
                  <input 
                    type="password"
                    placeholder="Cole seu token aqui..."
                    value={githubToken}
                    onChange={handleTokenChange}
                    className="w-full px-3 py-2 border border-[#ea92be]/30 rounded-xl text-sm focus:border-[#ea92be] focus:outline-none bg-[#fcf7f9] transition-colors"
                  />
                  <p className="text-[10px] text-[#cd3b8c]/70 leading-tight font-medium">
                    🔐 O token é salvo localmente neste navegador e usado para salvar alterações no GitHub.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </>
      )}

      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src="https://i.imgur.com/hjYKW2Y.jpeg" alt="" className="w-full h-full object-cover opacity-10" />
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] translate-y-[1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full block" style={{ height: waveHeight * 4 }}>
          <motion.path 
            initial={false}
            animate={{ d: wavePath }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1],
              delay: ((isHome || isMediaKit) && !isScrolled) ? 0.1 : 0 
            }}
            fill="#fcf7f9"
          />
        </svg>
      </div>

      {/* Fade Mask (only for home scroll) */}
      <motion.div 
        initial={false}
        animate={{ opacity: ((isHome || isMediaKit) && isScrolled) ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="absolute top-full left-0 right-0 h-24 bg-gradient-to-b from-[#fcf7f9] via-[#fcf7f9]/80 to-transparent pointer-events-none" 
      />

      {/* Profile Image */}
      <motion.div 
        initial={false}
        animate={{
          top: imgConfig.top,
          left: imgConfig.left,
          x: imgConfig.x,
          width: imgConfig.size,
          height: imgConfig.size,
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.4, 0, 0.2, 1],
          delay: ((isHome || isMediaKit) && !isScrolled) ? 0.1 : 0 
        }}
        className="absolute z-10"
      >
        <motion.div 
          initial={false}
          animate={{ borderRadius: imgConfig.borderRadius }}
          style={{ borderRadius: imgConfig.borderRadius }}
          className={`w-full h-full bg-[#fcf7f9] overflow-hidden border-[#fcf7f9] transition-all duration-300 ease-in-out ${((isHome || isMediaKit) && isScrolled) ? 'border-2 shadow-sm' : 'border-4 shadow-md'}`}
        >
          <img src={data.settings.profileImage} alt="Renata Lugon" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </motion.div>
      </motion.div>

      {/* Compact Name (Appears on scroll or home) */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: ((isHome || isMediaKit) && isScrolled) ? 1 : 0,
          x: ((isHome || isMediaKit) && isScrolled) ? 0 : -20,
        }}
        transition={{ 
          duration: ((isHome || isMediaKit) && isScrolled) ? 0.4 : 0.1, 
          ease: "easeOut",
          delay: ((isHome || isMediaKit) && isScrolled) ? 0.42 : 0 
        }}
        className="absolute top-[73px] left-[82px] z-0"
      >
        <h1 className="font-serif font-bold text-white text-[1rem] leading-[1.25rem]">
          Renata Lugon
        </h1>
      </motion.div>
    </motion.header>
  );
};
