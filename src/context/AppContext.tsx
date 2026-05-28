import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { Movie } from '../types';

interface AppContextType {
  myList: Movie[];
  addToList: (movie: Movie) => void;
  removeFromList: (id: number) => void;
  isInList: (id: number) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [myList, setMyList] = useState<Movie[]>(() => {
    const stored = localStorage.getItem('cinerich-mylist');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cinerich-mylist', JSON.stringify(myList));
  }, [myList]);

  const addToList = (movie: Movie) => {
    setMyList((prev) => [...prev, movie]);
  };

  const removeFromList = (id: number) => {
    setMyList((prev) => prev.filter((movie) => movie.id !== id));
  };

  const isInList = (id: number) => {
    return myList.some((movie) => movie.id === id);
  };

  return (
    <AppContext.Provider
      value={{ myList, addToList, removeFromList, isInList }}
    >
        {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}