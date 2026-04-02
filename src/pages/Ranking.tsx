import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Trash2, Plus, Save, Key, Loader2 } from 'lucide-react';
import { AddRankingModal } from '../components/AddRankingModal';
import { EditRankingModal } from '../components/EditRankingModal';
import { useNavigate } from 'react-router-dom';

export const Ranking: React.FC<{ isDev?: boolean }> = ({ isDev }) => {
  const { data, updateData, saveToGitHub } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) setGithubToken(savedToken);
  }, []);

  const handleSave = async () => {
    if (!githubToken) {
      alert('Por favor, insira seu Token do GitHub no campo que aparece no topo para salvar permanentemente.');
      return;
    }
    setIsSaving(true);
    try {
      localStorage.setItem('github_token', githubToken);
      await saveToGitHub(data, githubToken);
      alert('Alterações salvas com sucesso no GitHub! O site será atualizado em alguns minutos.');
      navigate('/ranking');
    } catch (error: any) {
      alert('Erro ao salvar no GitHub: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    updateData({ ranking: data.ranking.filter(r => r.id !== id) });
  };

  const handleEdit = (updatedItem: any) => {
    updateData({
      ranking: data.ranking.map(r => r.id === editingItem.id ? { ...r, ...updatedItem } : r)
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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[340px] px-4">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-[#ea92be] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#cd3b8c] text-xs font-bold mb-1">
              <Key size={14} />
              <span>TOKEN DO GITHUB</span>
            </div>
            <input 
              type="password"
              placeholder="Cole seu token aqui..."
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-full px-3 py-2 border border-[#ea92be] rounded-xl text-sm focus:ring-2 focus:ring-magenta focus:outline-none bg-white"
            />
          </div>
        </div>
      )}

      <div className="border-y-2 border-[#ea92be] py-2 mb-8 bg-[#fcf7f9] relative">
        <h2 className="font-serif text-[24px] font-bold text-[#cd3b8c] text-center tracking-tight">
          Ranking literário
        </h2>
      </div>

      {isDev && (
        <div className="px-6 mb-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#ea92be] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#cd3b8c] transition-colors shadow-sm"
          >
            <Plus size={20} />
            Adicionar ao Ranking
          </button>
        </div>
      )}

      <div className="px-6 flex flex-col gap-4">
        {data.ranking.map((item, index) => {
          const isExternal = item.link && item.link.startsWith('http');
          const className = "w-full flex items-center p-1.5 bg-[#fcf7f9] border-[1.5px] border-[#ea92be] rounded-l-full rounded-r-sm text-[#cd3b8c] transition-all font-medium text-[15px] group shadow-sm hover:shadow-md relative cursor-pointer";
          
          const ItemContent = (
            <motion.div 
              whileHover={{ scale: 1.01 }}
              onClick={() => isDev && setEditingItem(item)}
              className={className}
            >
              {isDev && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full z-10 shadow-md hover:bg-red-600 transition-colors"
                  title="Remover do Ranking"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-[#ea92be] flex items-center justify-center shrink-0 mr-4 font-bold text-white text-lg">
                {index + 1}
              </div>
              <span className="flex-grow text-left">{item.name}</span>
            </motion.div>
          );

          if (isExternal && !isDev) {
            return (
              <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                {ItemContent}
              </a>
            );
          }

          return (
            <div key={item.id}>
              {ItemContent}
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
          <AddRankingModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onAdd={(item) => {
              const newItem = { id: Date.now(), ...item };
              updateData({ ranking: [...data.ranking, newItem] });
            }} 
          />
          <EditRankingModal 
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
