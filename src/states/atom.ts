import { atom } from "jotai";
type fromWhicScreen = "home" | "likedMovies";
export const isAllMoviePageOpen = atom(false);
export const fromWhichScreenMovieDetails = atom<fromWhicScreen>("home");
