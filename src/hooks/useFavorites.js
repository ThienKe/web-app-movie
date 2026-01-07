// src/hooks/useFavorites.js
import { useState, useEffect } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m._id === movie._id);
      let newFavorites;
      if (exists) {
        newFavorites = prev.filter((m) => m._id !== movie._id);
      } else {
        newFavorites = [...prev, movie];
      }
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (movieId) => {
    return favorites.some((m) => m._id === movieId);
  };

  return { favorites, toggleFavorite, isFavorite };
};