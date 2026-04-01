import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';
import { Instagram, Youtube } from 'lucide-react';
import { useData } from '../context/DataContext';

const TikTokIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const MediaKit: React.FC = () => {
  const { data } = useData();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const scrolled = latest > 30;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    });
  }, [scrollY]);
  const [stats] = useState({
    followers: 250,
    reach: 12500,
    interactions: 43200,
    engagementRate: 19.8
  });

  const demographicData = {
    gender: [
      { label: 'Mulher', percentage: 85, icon: '♀' },
      { label: 'Homem', percentage: 15, icon: '♂' }
    ],
    age: [
      { label: '25-35', percentage: 45 },
      { label: '18-24', percentage: 35 },
      { label: '35-44', percentage: 20 }
    ]
  };

  const statCards = [
    { value: '250', label: 'Média de\nSeguidores' },
    { value: '12.5K', label: 'Média de\nalcance' },
    { value: '43.2K', label: 'Média de\nInterações' },
    { value: '19.8%', label: 'Média de\nEngajamento' }
  ];

  const portfolioImages = [
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop'
  ];

  return (
    <div className="relative z-10">
      {/* Fixed Text Behind Content */}
      <div className="fixed top-[300px] left-0 w-full text-center z-0 flex flex-col items-center">
        <h1 className="font-serif font-bold text-[#cd3b8c] text-4xl mb-1">Renata Lugon</h1>
        <p className="text-[#cd3b8c] font-medium mb-4">Vídeos literários</p>
        <div className="flex gap-4 relative group">
          <a href={data.settings.instagram} target="_blank" rel="noopener noreferrer" className="text-[#cd3b8c] hover:text-[#cd3b8c] transition-colors"><Instagram size={24} /></a>
          <a href={data.settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-[#cd3b8c] hover:text-[#cd3b8c] transition-colors"><TikTokIcon size={24} /></a>
          <a href={data.settings.youtube} target="_blank" rel="noopener noreferrer" className="text-[#cd3b8c] hover:text-[#cd3b8c] transition-colors"><Youtube size={24} /></a>
        </div>
      </div>

      {/* Transparent Spacer - allows fixed text behind to be visible */}
      <div 
        className="transition-all duration-300 ease-in-out" 
        style={{ height: isScrolled ? '260px' : '480px' }} 
      />
      
      {/* Content with Background - covers the fixed text as it scrolls up */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full bg-[#fcf7f9] min-h-screen"
      >
        {/* Main Content */}
        <div className="px-6 pb-12 max-w-6xl mx-auto">
        
        {/* About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl p-8 border border-magenta/20 shadow-sm">
            <h3 className="font-bold text-magenta text-2xl mb-4">Sobre mim</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Criadora de conteúdo literário que compartilha leituras, indicações e unboxings de forma autêntica, criativa e apaixonada.
            </p>
          </div>
        </motion.div>

        {/* Demographic Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-serif text-3xl font-bold text-magenta mb-8">Audiência demográfica</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Gender */}
            <div className="bg-white rounded-2xl p-8 border border-magenta/20">
              <h3 className="font-bold text-magenta text-xl mb-6">Gênero</h3>
              <div className="flex items-center justify-around">
                {demographicData.gender.map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <div className="text-3xl font-bold text-magenta mb-1">{item.percentage}%</div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="bg-white rounded-2xl p-8 border border-magenta/20">
              <h3 className="font-bold text-magenta text-xl mb-6">Idade</h3>
              <div className="space-y-4">
                {demographicData.age.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700 w-12">{item.label}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.8 + idx * 0.1, duration: 0.8 }}
                        className="h-full bg-magenta rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {statCards.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border-2 border-magenta text-center"
            >
              <div className="text-3xl font-bold text-magenta mb-2">{stat.value}</div>
              <div className="text-xs text-gray-600 whitespace-pre-line leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Portfolio Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-12"
        >
          <h2 className="font-serif text-3xl font-bold text-magenta mb-6">Portfólio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioImages.map((image, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + idx * 0.05 }}
                className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img 
                  src={image} 
                  alt={`Portfolio ${idx + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-2xl p-8 border border-magenta/20 text-center mb-8"
        >
          <h2 className="font-serif text-3xl font-bold text-magenta mb-8">Contatos</h2>
          <div className="space-y-4">
            <a 
              href="mailto:renataverso13@gmail.com"
              className="flex items-center justify-center gap-3 text-magenta hover:text-magenta/80 transition-colors"
            >
              <span className="text-2xl">✉</span>
              <span className="font-semibold">renataverso13@gmail.com</span>
            </a>
            <a 
              href="https://instagram.com/renataverso"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 text-magenta hover:text-magenta/80 transition-colors"
            >
              <span className="text-2xl">📱</span>
              <span className="font-semibold">@renataverso</span>
            </a>
          </div>
        </motion.div>
        </div>
      </motion.div>
    </div>
  );
};