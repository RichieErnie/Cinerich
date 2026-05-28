import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import MyList from './pages/MyList';
import { AppProvider } from './context/AppContext';
import './index.css';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <Navbar />
        <main className="pt-14 md:pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
