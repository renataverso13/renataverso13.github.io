import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Trash2, Plus, Save, Key, Loader2 } from 'lucide-react';
import { AddBookModal } from '../components/AddBookModal';
import { EditBookModal } from '../components/EditBookModal';
import { useNavigate } from 'react-router-dom';

export const Livros: React.FC<{ isDev?: boolean }> = ({ isDev }) => {
  const { data, updateData, saveToGitHub } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);
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
      navigate('/livros');
    } catch (error: any) {
      alert('Erro ao salvar no GitHub: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    updateData({ books: data.books.filter(b => b.id !== id) });
  };

  const handleEdit = (updatedBook: any) => {
    updateData({
      books: data.books.map(b => b.id === editingBook.id ? { ...b, ...updatedBook } : b)
    });
    setEditingBook(null);
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
          Livros que recomendo
        </h2>
      </div>

      {isDev && (
        <div className="px-6 mb-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#ea92be] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#cd3b8c] transition-colors shadow-sm"
          >
            <Plus size={20} />
            Adicionar Novo Livro
          </button>
        </div>
      )}

      <div className="px-6 grid grid-cols-2 gap-x-4 gap-y-6">
        {data.books.map((book) => {
          const CardContent = (
            <motion.div 
              key={book.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => isDev && setEditingBook(book)}
              className="flex flex-col bg-[#fcf7f9] rounded-[20px] p-2 shadow-sm border-[1.5px] border-[#ea92be] hover:shadow-md transition-shadow h-full cursor-pointer relative"
            >
              {isDev && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(book.id);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full z-10 shadow-md hover:bg-red-600 transition-colors"
                  title="Remover Livro"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <div className="w-full aspect-square rounded-[18px] overflow-hidden mb-3 border border-[#ea92be]/20">
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="text-center px-1 pb-2">
                <h3 className="font-bold text-[#cd3b8c] text-[13px] leading-tight line-clamp-2">
                  {book.title}
                </h3>
              </div>
            </motion.div>
          );

          return book.link && !isDev ? (
            <a href={book.link} target="_blank" rel="noopener noreferrer" key={book.id} className="block">
              {CardContent}
            </a>
          ) : (
            <div key={book.id}>
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
          <AddBookModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onAdd={(book) => {
              const newBook = { id: Date.now(), ...book };
              updateData({ books: [...data.books, newBook] });
            }} 
          />
          <EditBookModal 
            isOpen={!!editingBook}
            onClose={() => setEditingBook(null)}
            onEdit={handleEdit}
            book={editingBook}
          />
        </>
      )}
    </motion.div>
  );
};
