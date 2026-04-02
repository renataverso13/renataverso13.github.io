import React, { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'motion/react';
import { BookOpen, Tablet, Heart, Trophy, Link as LinkIcon, Play, Instagram, Youtube, Plus, Trash2, Save, Edit2, Key, Loader2, Settings, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { EditSocialModal } from '../components/EditSocialModal';
import { AddButtonModal } from '../components/AddButtonModal';
import { EditButtonModal } from '../components/EditButtonModal';
import { EditProfileModal } from '../components/EditProfileModal';

// ============================================================================
// 🔄 ATUALIZAÇÃO AUTOMÁTICA OFICIAL E 100% GRATUITA (API DO INSTAGRAM)
// ============================================================================
const INSTAGRAM_ACCESS_TOKEN = "IGAAX3WGOV96ZABZAFlpRzRPQlZAaakNmSGJSQmFfVHkyWDVjemZAVWHB4MU5OR2N0bGtFQXB1QXBSNWZAUazFCRjZAUaFlrUHVNZA3BPOEd5T1Nva25GT3NkUUIyY3UzXy02VWdUSWdYamNCWl90Y2tpaWpHNDhXRkNMNjg1NHhTZADBhcwZDZD"; 

const REELS_DATA = [
  { id: 1, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop', link: 'https://www.instagram.com/renataverso/reels/' },
  { id: 2, img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop', link: 'https://www.instagram.com/renataverso/reels/' },
  { id: 3, img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop', link: 'https://www.instagram.com/renataverso/reels/' },
  { id: 4, img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop', link: 'https://www.instagram.com/renataverso/reels/' },
  { id: 5, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop', link: 'https://www.instagram.com/renataverso/reels/' },
  { id: 6, img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400&auto=format&fit=crop', link: 'https://www.instagram.com/renataverso/reels/' }
];

const TikTokIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const getIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'book': return <BookOpen className={className} aria-hidden="true" />;
    case 'tablet': return <Tablet className={className} aria-hidden="true" />;
    case 'heart': return <Heart className={className} aria-hidden="true" />;
    case 'trophy': return <Trophy className={className} aria-hidden="true" />;
    default: return <LinkIcon className={className} aria-hidden="true" />;
  }
};

let cachedInstagramFeed: any[] | null = null;

export const Home: React.FC<{ isDev?: boolean }> = ({ isDev }) => {
  const { data, updateData, saveToGitHub } = useData();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [liveReels, setLiveReels] = useState(cachedInstagramFeed || REELS_DATA);
  const [isLoading, setIsLoading] = useState(!cachedInstagramFeed);
  const [isSaving, setIsSaving] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [isTokenPanelOpen, setIsTokenPanelOpen] = useState(false);
  const navigate = useNavigate();

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isAddButtonModalOpen, setIsAddButtonModalOpen] = useState(false);
  const [editingButton, setEditingButton] = useState<any | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) setGithubToken(savedToken);
  }, []);

  useEffect(() => {
    const fetchInstagramFeed = async () => {
      if (cachedInstagramFeed) return;
      if (!INSTAGRAM_ACCESS_TOKEN) {
        setLiveReels(REELS_DATA);
        setIsLoading(false);
        return;
      }
      try {
        const url = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        const reels = data.data
          .filter((post: any) => post.media_type === 'VIDEO')
          .slice(0, 6)
          .map((post: any) => ({
            id: post.id,
            img: post.thumbnail_url || post.media_url,
            link: post.permalink
          }));
        if (reels.length > 0) {
          cachedInstagramFeed = reels;
          setLiveReels(reels);
        } else {
          setLiveReels(REELS_DATA);
        }
      } catch (error) {
        console.error("Erro ao carregar o feed do Instagram:", error);
        setLiveReels(REELS_DATA);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInstagramFeed();
  }, []);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const scrolled = latest > 30;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    });
  }, [scrollY]);

  const handleSave = async () => {
    if (!githubToken) {
      setIsTokenPanelOpen(true);
      alert('Por favor, insira seu Token do GitHub no campo que aparece no topo para salvar permanentemente.');
      return;
    }
    setIsSaving(true);
    try {
      localStorage.setItem('github_token', githubToken);
      await saveToGitHub(data, githubToken);
      alert('Alterações salvas com sucesso no GitHub! O site será atualizado em alguns minutos.');
      navigate('/');
    } catch (error: any) {
      alert('Erro ao salvar no GitHub: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteButton = (id: number) => {
    updateData({ buttons: data.buttons.filter(b => b.id !== id) });
  };

  const handleEditButton = (updatedButton: any) => {
    updateData({
      buttons: data.buttons.map(b => b.id === editingButton.id ? { ...b, ...updatedButton } : b)
    });
    setEditingButton(null);
  };

  const handleAddButton = (newButton: any) => {
    updateData({
      buttons: [...data.buttons, { id: Date.now(), ...newButton }]
    });
  };

  const handleEditSocials = (socials: any) => {
    updateData({
      settings: { ...data.settings, ...socials }
    });
  };

  const handleEditProfile = (profile: any) => {
    updateData({
      settings: { ...data.settings, ...profile }
    });
  };

  return (
    <div className="relative z-10">
      {isDev && (
        <>
          <button 
            onClick={() => setIsTokenPanelOpen(!isTokenPanelOpen)}
            className="fixed top-4 left-4 z-[9999] bg-[#ea92be] text-white p-2.5 rounded-full shadow-xl hover:bg-[#cd3b8c] transition-all active:scale-95"
            title="Configurações de Deploy"
          >
            {isTokenPanelOpen ? <X size={24} /> : <Settings size={24} />}
          </button>

          <AnimatePresence>
            {isTokenPanelOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="fixed top-16 left-4 z-[9999] w-full max-w-[300px]"
              >
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-[#ea92be] flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[#cd3b8c] text-xs font-black tracking-wider">
                    <Key size={14} />
                    <span>GITHUB TOKEN</span>
                  </div>
                  <input 
                    type="password"
                    placeholder="Cole seu token aqui..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-[#ea92be]/30 rounded-xl text-sm focus:border-[#ea92be] focus:outline-none bg-white transition-colors"
                  />
                  <p className="text-[10px] text-[#cd3b8c]/70 leading-tight">
                    O token é necessário para salvar as alterações permanentemente no GitHub.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <div className="fixed top-[300px] left-0 w-full text-center z-0 flex flex-col items-center">
        <h1 className="font-serif font-bold text-[#cd3b8c] text-4xl mb-1">Renata Lugon</h1>
        <p className="text-[#cd3b8c] font-medium mb-4">Vídeos literários</p>
        <div className="flex gap-4 relative group">
          {isDev && (
            <button 
              onClick={() => setIsSocialModalOpen(true)}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#ea92be] text-white p-1 rounded-full shadow-md hover:bg-[#cd3b8c] transition-colors z-20"
              title="Editar Redes Sociais"
            >
              <Edit2 size={14} />
            </button>
          )}
          <a href={data.settings.instagram} target="_blank" rel="noopener noreferrer" className="text-[#cd3b8c] hover:text-[#cd3b8c] transition-colors"><Instagram size={24} /></a>
          <a href={data.settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-[#cd3b8c] hover:text-[#cd3b8c] transition-colors"><TikTokIcon size={24} /></a>
          <a href={data.settings.youtube} target="_blank" rel="noopener noreferrer" className="text-[#cd3b8c] hover:text-[#cd3b8c] transition-colors"><Youtube size={24} /></a>
        </div>
      </div>

      <div 
        className="transition-all duration-300 ease-in-out" 
        style={{ height: isScrolled ? '260px' : '480px' }} 
      />
      
      <div className="bg-[#fcf7f9] pb-10 px-6 space-y-10 fade-in relative min-h-screen">
        <section className="grid grid-cols-3 gap-1.5 relative">
          {isLoading && INSTAGRAM_ACCESS_TOKEN && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#fcf7f9]/80 z-10">
              <div className="w-8 h-8 border-4 border-[#cd3b8c] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {liveReels.map((reel) => (
            <a 
              key={reel.id} 
              href={reel.link}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-[4/5] bg-gray-100 rounded overflow-hidden shadow-sm hover:scale-[1.02] transition-transform cursor-pointer border-2 border-[#ea92be] block relative group"
            >
              <img alt="Reel thumbnail" className="w-full h-full object-cover" src={reel.img} referrerPolicy="no-referrer" loading="lazy" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="text-white w-8 h-8 fill-white" />
              </div>
            </a>
          ))}
        </section>

        <section className="space-y-4">
          {data.buttons.map((btn) => {
            const isExternal = btn.link.startsWith('http');
            const className = "w-full flex items-center p-1.5 bg-[#fcf7f9] border-[1.5px] border-[#ea92be] rounded-l-full rounded-r-sm text-[#cd3b8c] transition-all font-medium text-[15px] group shadow-sm hover:shadow-md relative cursor-pointer";
            
            const InnerContent = (
              <>
                {isDev && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteButton(btn.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full z-10 shadow-md hover:bg-red-600 transition-colors"
                    title="Remover Botão"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="w-10 h-10 rounded-full bg-[#ea92be] flex items-center justify-center shrink-0 mr-4">
                  {getIcon(btn.icon, "w-5 h-5 text-white")}
                </div>
                <span>{btn.label}</span>
              </>
            );

            if (isDev) {
              return (
                <div key={btn.id} className={className} onClick={() => setEditingButton(btn)}>
                  {InnerContent}
                </div>
              );
            }

            if (isExternal) {
              return (
                <a key={btn.id} href={btn.link} target="_blank" rel="noopener noreferrer" className={className}>
                  {InnerContent}
                </a>
              );
            }

            return (
              <Link key={btn.id} to={btn.link} className={className}>
                {InnerContent}
              </Link>
            );
          })}
        </section>

        <div 
          className="bg-[#fcf7f9] rounded-[20px] p-4 shadow-sm border-[1.5px] border-[#ea92be] relative mt-8 block hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            if (isDev) {
              setIsProfileModalOpen(true);
            } else {
              navigate('/mediakit');
            }
          }}
        >
          {isDev && (
            <div className="absolute -top-3 -right-3 bg-[#ea92be] text-white p-1.5 rounded-full z-10 shadow-md hover:bg-[#cd3b8c] transition-colors">
              <Edit2 size={14} />
            </div>
          )}
          <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 bg-[#cd3b8c] text-white px-5 py-[3px] rounded-full text-[13px] font-medium whitespace-nowrap">
            Mídia Kit
          </div>
          {!isDev && (
            <div className="absolute top-3 right-3 text-[#cd3b8c]">
              <LinkIcon className="w-[18px] h-[18px] rotate-45" strokeWidth={2.5} />
            </div>
          )}
          <div className="flex flex-row items-center gap-4 mt-1">
            <div className="relative w-[125px] h-[135px] shrink-0 arch-image bg-white border-[1.5px] border-[#cd3b8c] p-[5px]">
              <div className="w-full h-full arch-image overflow-hidden">
                <img alt="Renata" className="w-full h-full object-cover" src={data.settings.profileImage} referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="flex-1 text-left">
              <div className="mb-2">
                <h3 className="font-serif font-bold text-[#cd3b8c] text-[20px] leading-[1.05] tracking-tight w-fit transform scale-x-[1.12] origin-left">Renata<br/>Lugon</h3>
                <p className="text-[#cd3b8c] text-[8.5px] font-semibold mt-1">Vídeos literários</p>
              </div>
              <div className="space-y-0">
                <h4 className="font-bold text-[#cd3b8c] text-[10px]">Sobre mim</h4>
                <p className="text-[#cd3b8c] text-[7.5px] leading-[1.15] pr-2 font-medium mt-0.5">
                  {data.settings.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDev && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3 w-full max-w-[340px] px-4">
          <button 
            onClick={() => setIsAddButtonModalOpen(true)}
            className="flex-1 bg-[#fcf7f9] text-[#ea92be] border-2 border-[#ea92be] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors shadow-lg"
          >
            <Plus size={20} />
            Adicionar
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-[#ea92be] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#cd3b8c] transition-colors shadow-lg disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      )}

      {isDev && (
        <>
          <EditSocialModal 
            isOpen={isSocialModalOpen}
            onClose={() => setIsSocialModalOpen(false)}
            onEdit={handleEditSocials}
            socials={{
              instagram: data.settings.instagram,
              tiktok: data.settings.tiktok,
              youtube: data.settings.youtube
            }}
          />
          <AddButtonModal 
            isOpen={isAddButtonModalOpen}
            onClose={() => setIsAddButtonModalOpen(false)}
            onAdd={handleAddButton}
          />
          <EditButtonModal 
            isOpen={!!editingButton}
            onClose={() => setEditingButton(null)}
            onEdit={handleEditButton}
            button={editingButton}
          />
          <EditProfileModal 
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            onEdit={handleEditProfile}
            profile={{
              bio: data.settings.bio,
              profileImage: data.settings.profileImage
            }}
          />
        </>
      )}
    </div>
  );
};
