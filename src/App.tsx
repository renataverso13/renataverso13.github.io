/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { DataProvider } from './context/DataContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Livros } from './pages/Livros';
import { Acessorios } from './pages/Acessorios';
import { Ranking } from './pages/Ranking';
import { MediaKit } from './pages/MediaKit';
import { DevPanel } from './pages/DevPanel';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/livros" element={<Livros />} />
        <Route path="/livros/dev" element={<Livros isDev />} />
        <Route path="/acessorios" element={<Acessorios />} />
        <Route path="/acessorios/dev" element={<Acessorios isDev />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/ranking/dev" element={<Ranking isDev />} />
        <Route path="/mediakit" element={<MediaKit />} />
        <Route path="/dev" element={<Home isDev />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <div className="flex-1 flex flex-col min-h-screen font-sans">
          <Header />
          <main className="flex-1 relative z-10">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}
