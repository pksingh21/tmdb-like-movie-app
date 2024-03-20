import { atom } from "jotai";
type fromWhicScreen = "home" | "likedMovies" | "searchMovies";
export const isAllMoviePageOpen = atom(false);
export const fromWhichScreenMovieDetails = atom<fromWhicScreen>("home");
