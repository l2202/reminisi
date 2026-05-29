import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  games: [],
};

const favoriteGamesSlice = createSlice({
  name: "favoriteGames",
  initialState,
  reducers: {
    addFavoriteGame: (state, action) => {
      const game = action.payload;
      const alreadyExists = state.games.some((favorite) => favorite.id === game.id);

      if (!alreadyExists) {
        state.games.push(game);
      }
    },
    removeFavoriteGame: (state, action) => {
      state.games = state.games.filter((game) => game.id !== action.payload);
    },
    toggleFavoriteGame: (state, action) => {
      const game = action.payload;
      const alreadyExists = state.games.some((favorite) => favorite.id === game.id);

      if (alreadyExists) {
        state.games = state.games.filter((favorite) => favorite.id !== game.id);
        return;
      }

      state.games.push(game);
    },
    clearFavoriteGames: (state) => {
      state.games = [];
    },
  },
});

export const {
  addFavoriteGame,
  removeFavoriteGame,
  toggleFavoriteGame,
  clearFavoriteGames,
} = favoriteGamesSlice.actions;

export const selectFavoriteGames = (state) => state.favoriteGames.games;
export const selectIsFavoriteGame = (gameId) => (state) =>
  state.favoriteGames.games.some((game) => game.id === gameId);

export default favoriteGamesSlice.reducer;
