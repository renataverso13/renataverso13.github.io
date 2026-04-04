import React, { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../data.json';

export type ButtonData = {
  id: number;
  label: string;
  icon: string;
  link: string;
};

export type BookData = {
  id: number;
  title: string;
  author: string;
  cover: string;
  link: string;
};

export type AccessoryData = {
  id: number;
  name: string;
  image: string;
  link: string;
};

export type RankingData = {
  id: number;
  name: string;
  link: string;
};

export type SettingsData = {
  email: string;
  bio: string;
  profileImage: string;
  instagram: string;
  tiktok: string;
  youtube: string;
};

export type AppData = {
  version?: number;
  buttons: ButtonData[];
  books: BookData[];
  accessories: AccessoryData[];
  ranking: RankingData[];
  settings: SettingsData;
};

type DataContextType = {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  saveToGitHub: (updatedData: AppData, token: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const REPO_OWNER = "renataverse";
const REPO_NAME = "renataverse.github.io";
const FILE_PATH = "src/data.json";
const STORAGE_KEY = 'renataverso_data';
const STORAGE_VERSION_KEY = 'renataverso_data_version';

// Versão embutida no bundle no momento do build
const BUNDLE_VERSION = (initialData as AppData).version ?? 0;

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    // Verifica se o localStorage tem dados de uma versão mais antiga que o bundle atual
    try {
      const savedVersionStr = localStorage.getItem(STORAGE_VERSION_KEY);
      const savedVersion = savedVersionStr ? parseInt(savedVersionStr, 10) : -1;

      // Se o bundle é mais novo que o que está salvo, descarta o localStorage
      if (BUNDLE_VERSION > savedVersion) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_VERSION_KEY, String(BUNDLE_VERSION));
        return initialData as AppData;
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialData,
          ...parsed,
          settings: {
            ...initialData.settings,
            ...(parsed.settings || {})
          }
        } as AppData;
      }
    } catch (e) {
      console.error("Falha ao ler dados salvos:", e);
    }
    return initialData as AppData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STORAGE_VERSION_KEY, String(data.version ?? BUNDLE_VERSION));
  }, [data]);

  const updateData = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const saveToGitHub = async (updatedData: AppData, token: string) => {
    try {
      // Incrementa a versão a cada salvamento para invalidar o localStorage de todos os usuários
      const newVersion = (updatedData.version ?? BUNDLE_VERSION) + 1;
      const dataWithVersion: AppData = { ...updatedData, version: newVersion };

      // 1. Busca o arquivo atual para obter o SHA
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!getFileResponse.ok) {
        throw new Error("Falha ao buscar arquivo no GitHub. Verifique se o token é válido.");
      }

      const fileData = await getFileResponse.json();
      const sha = fileData.sha;

      // 2. Atualiza o arquivo com a nova versão
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(dataWithVersion, null, 2))));

      const updateResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `chore: update site data (v${newVersion})`,
            content: content,
            sha: sha,
          }),
        }
      );

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(error.message || "Falha ao atualizar arquivo no GitHub");
      }

      // Atualiza o estado local com a nova versão também
      setData(dataWithVersion);

      console.log(`Dados salvos no GitHub com sucesso! Versão: ${newVersion}`);
    } catch (error) {
      console.error("Erro ao salvar no GitHub:", error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{ data, updateData, saveToGitHub }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
