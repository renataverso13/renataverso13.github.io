import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

export const Header: React.FC = () => {
  const { data } = useData();
  const location = useLocation();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const isHome = location.pathname === '/' || location.pathname === '/dev' || location.pathname === '/mediakit';

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const scrolled = latest > 30;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    });
  }, [scrollY]);

  // Determine target values based on page and scroll state
  const headerHeight = isHome ? (isScrolled ? 100 : 250) : 200;
  
  const wavePath = (isHome && isScrolled) 
    ? "M0,118 Q300,118 600,118 T1200,118 L1200,125 L0,125 Z" 
    : "M0,50 Q300,120 600,50 T1200,50 L1200,125 L0,125 Z";

  const waveHeight = isHome ? 20 : 20;

  const imgConfig = {
    top: isHome ? 64 : 90,
    left: (isHome && isScrolled) ? 24 : '50%',
    x: (isHome && isScrolled) ? 0 : '-50%',
    size: isHome ? (isScrolled ? 50 : 224) : 120,
    borderRadius: isHome ? (location.pathname === '/mediakit' && !isScrolled ? '40px' : '160px 160px 0 0') : '100px 100px 0 0'
  };

  return (
    <motion.header 
      initial={false}
      animate={{ height: headerHeight }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1],
        delay: (isHome && !isScrolled) ? 0.1 : 0 
      }}
      className={`${isHome ? 'fixed' : 'absolute'} top-0 left-0 right-0 z-50 bg-magenta bg-pattern`}
    >
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
              delay: (isHome && !isScrolled) ? 0.1 : 0 
            }}
            fill="#fcf7f9"
          />
        </svg>
      </div>

      {/* Fade Mask (only for home scroll) */}
      <motion.div 
        initial={false}
        animate={{ opacity: (isHome && isScrolled) ? 1 : 0 }}
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
          delay: (isHome && !isScrolled) ? 0.1 : 0 
        }}
        className="absolute z-10"
      >
        <motion.div 
          initial={false}
          animate={{ borderRadius: imgConfig.borderRadius }}
          style={{ borderRadius: imgConfig.borderRadius }}
          className={`w-full h-full bg-[#fcf7f9] overflow-hidden border-[#fcf7f9] transition-all duration-300 ease-in-out ${(isHome && isScrolled) ? 'border-2 shadow-sm' : 'border-4 shadow-md'}`}
        >
          <img src={data.settings.profileImage} alt="Renata Lugon" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </motion.div>
      </motion.div>

      {/* Compact Name (Appears on scroll or home) */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: (isHome && isScrolled) ? 1 : 0,
          x: (isHome && isScrolled) ? 0 : -20,
        }}
        transition={{ 
          duration: (isHome && isScrolled) ? 0.4 : 0.1, 
          ease: "easeOut",
          delay: (isHome && isScrolled) ? 0.42 : 0 
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


