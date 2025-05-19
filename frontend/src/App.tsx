import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TryOnPage from './pages/TryOnPage';
import AboutPage from './pages/AboutPage';
import './index.css';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/try-on" element={<TryOnPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <footer className="bg-white shadow-inner py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Virtual Tryon. All rights reserved.
                  </p>
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App; 