import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import ChatBot from './components/ChatBot/ChatBot';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <FavoritesProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/favorites" element={<Favorites />} />
                </Routes>
              </main>
              <Footer />
              
              {/* Toast notifications */}
              <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                className="z-50"
              />
              
              {/* AI Chatbot */}
              <ChatBot />
      </div>
          </FavoritesProvider>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
