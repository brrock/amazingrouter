import { createContext } from "react";
import type { RouterContextProps } from "./types";

export const RouterContext = createContext<RouterContextProps | null>(null);
