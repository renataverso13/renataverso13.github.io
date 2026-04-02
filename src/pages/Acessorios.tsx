import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Trash2, Plus, Save, Key, Loader2, Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddAcessorioModal } from '../components/AddAcessorioModal';
import { EditAcessorioModal } from '../components/EditAcessorioModal';

export const Acessorios: React.FC<{ isDev?: boolean }> = ({ isDev }) => {
  const { data, updateData, saveToGitHub } = useData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [isTokenPanelOpen, setIsTokenPanelOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) setGithubToken(savedToken);
  }, []);

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
      navigate('/acessorios');
    } catch (error: any) {
      alert('Erro ao salvar no GitHub: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    updateData({ accessories: data.accessories.filter(a => a.id !== id) });
  };

  const handleEdit = (updatedItem: any) => {
    updateData({
      accessories: data.accessories.map(a => a.id === editingItem.id ? { ...a, ...updatedItem } : a)
    });
    setEditingItem(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-10 pt-[240px]"
    >
      {isDev && (
        <>
          <button 
            onClick={() => setIsTokenPanelOpen(!isTokenPanelOpen)}
            className="fixed top-4 left-4 z-[110] bg-[#ea92be] text-white p-2.5 rounded-full shadow-xl hover:bg-[#cd3b8c] transition-all active:scale-95"
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
                className="fixed top-16 left-4 z-[100] w-full max-w-[300px]"
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

      <div className="border-y-2 border-[#ea92be] py-2 mb-8 bg-[#fcf7f9] relative">
        <h2 className="font-serif text-[24px] font-bold text-[#cd3b8c] text-center tracking-tight">
          Acessórios para Kindle
        </h2>
      </div>

      {isDev && (
        <div className="px-6 mb-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#ea92be] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#cd3b8c] transition-colors shadow-sm"
          >
            <Plus size={20} />
            Adicionar Novo Acessório
          </button>
        </div>
      )}

      <div className="px-6 grid grid-cols-2 gap-x-4 gap-y-6">
        {data.accessories.map((item) => {
          const CardContent = (
            <motion.div 
              key={item.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => isDev && setEditingItem(item)}
              className="flex flex-col bg-[#fcf7f9] rounded-[20px] p-2 shadow-sm border-[1.5px] border-[#ea92be] hover:shadow-md transition-shadow h-full cursor-pointer relative"
            >
              {isDev && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full z-10 shadow-md hover:bg-red-600 transition-colors"
                  title="Remover Acessório"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <div className="w-full aspect-square rounded-[18px] overflow-hidden mb-3 border border-[#ea92be]/20">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="text-center px-1 pb-2">
                <h3 className="font-bold text-[#cd3b8c] text-[13px] leading-tight line-clamp-2">
                  {item.name}
                </h3>
              </div>
            </motion.div>
          );

          return item.link && !isDev ? (
            <a href={item.link} target="_blank" rel="noopener noreferrer" key={item.id} className="block">
              {CardContent}
            </a>
          ) : (
            <div key={item.id}>
              {CardContent}
            </div>
          );
        })}
      </div>

      {isDev && (
        <div className="px-6 mt-8">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[#ea92be] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#cd3b8c] transition-colors shadow-md text-lg disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={22} className="animate-spin" /> : <Save size={22} />}
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      )}

      {isDev && (
        <>
          <AddAcessorioModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onAdd={(item) => {
              const newItem = { id: Date.now(), ...item };
              updateData({ accessories: [...data.accessories, newItem] });
            }} 
          />
          <EditAcessorioModal 
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            onEdit={handleEdit}
            item={editingItem}
          />
        </>
      )}
    </motion.div>
  );
};
