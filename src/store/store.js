import { configureStore } from "@reduxjs/toolkit";
import favoriteGamesReducer from "../reducers/favoriteGamesSlice";

export const store = configureStore({
  reducer: {
    favoriteGames: favoriteGamesReducer,
  },
});
