import { ComponentType } from "react";

// Shape of the modules imported by import.meta.glob
export interface PageModule {
  default: ComponentType<unknown>;
}

// Internal representation of a route
export interface Route {
  path: string;
  regex: RegExp;
  paramNames: string[];
  component: ComponentType<unknown>;
  layoutPaths: string[];
  originalFilePath: string;
}

// Data stored in the Router context
export interface RouterContextProps {
  pathname: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
  navigate: (to: string) => void;
}

// Result of matching a pathname against routes
export interface RouteMatch {
  route: Route;
  params: Record<string, string>;
}

// Props for the Link component
export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}
