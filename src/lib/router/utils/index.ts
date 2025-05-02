import type { PageModule,  } from "../types";

// Read base path from Vite config (vite.config.ts -> base: '/your-base/')
// Defaults to '/' if not set. Make sure it ends with a slash.
export const BASE_URL =
  (import.meta.env.BASE_URL || "/").replace(/\/$/, "") + "/";

/** Removes the base path from an absolute pathname */
export const stripBasePath = (pathname: string): string => {
  if (BASE_URL !== "/" && pathname.startsWith(BASE_URL)) {
    return pathname.substring(BASE_URL.length - 1);
  }
  return pathname;
};

/** Constructs a full absolute path including the base path */
export const constructFullPath = (appRelativePath: string): string => {
  const relativePath = appRelativePath.startsWith("/")
    ? appRelativePath
    : `/${appRelativePath}`;
  return (BASE_URL + relativePath.substring(1)).replace(/\/$/, "") || "/";
};

/** Converts a file path to a route object (path, regex, params) */
export const createRouteFromFilePath = (
  filePath: string,
  type: "page" | "layout",
): { path: string; regex: RegExp; paramNames: string[] } | null => {
  let path = filePath
    .replace(/^\/src\/app/, "")
    // eslint-disable-next-line no-useless-escape
    .replace(new RegExp(`\/${type}\\.tsx$`), "")
    .replace(/\/$/, "");

  if (path === "") path = "/";
  path = path.replace(/\/\([^)]+\)/g, "");

  const paramNames: string[] = [];
  const regexString =
    "^" +
    path
      .split("/")
      .map((segment) => {
        const match = segment.match(/^\[(.+?)\]$/);
        if (match) {
          paramNames.push(match[1]);
          return "([^/]+?)";
        }
        return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("\\/") +
    "$";

  const regex = new RegExp(regexString, "i");
  const displayPath = path.replace(/\[(.+?)\]/g, ":$1");

  return { path: displayPath, regex, paramNames };
};

/** Finds all applicable layout file paths for a given page file path */
export const findLayoutPaths = (
  pageFilePath: string,
  allLayoutFiles: Record<string, PageModule>,
): string[] => {
  const segments = pageFilePath.replace(/^\/src\/app/, "").split("/");
  const layoutPaths: string[] = [];
  let currentPath = "/src/app";

  if (allLayoutFiles["/src/app/layout.tsx"]) {
    layoutPaths.push("/src/app/layout.tsx");
  }

  for (let i = 1; i < segments.length - 1; i++) {
    currentPath += `/${segments[i]}`;
    const layoutFile = `${currentPath.replace(/\/\([^)]+\)/g, "")}/layout.tsx`;
    if (allLayoutFiles[layoutFile]) {
      layoutPaths.push(layoutFile);
    }
  }

  return layoutPaths;
};
