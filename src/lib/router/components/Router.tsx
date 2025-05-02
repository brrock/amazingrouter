import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
} from "react";
import { RouterContext } from "../context";
import {
  stripBasePath,
  constructFullPath,
  createRouteFromFilePath,
  findLayoutPaths,
} from "../utils";
import type { PageModule, Route, RouteMatch } from "../types";

// Eagerly import all page and layout files
const pageFiles = import.meta.glob<PageModule>("/src/app/**/page.tsx", {
  eager: true,
});
const layoutFiles = import.meta.glob<PageModule>("/src/app/**/layout.tsx", {
  eager: true,
});
const notFoundFile = import.meta.glob<PageModule>("/src/app/not-found.tsx", {
  eager: true,
});

const NotFoundPage = Object.values(notFoundFile)[0]?.default;
const RootLayout = layoutFiles["/src/app/layout.tsx"]?.default;

// Generate routes from page files
const routes: Route[] = Object.entries(pageFiles)
  .map(([filePath, module]) => {
    const routeInfo = createRouteFromFilePath(filePath, "page");
    if (!routeInfo || !module?.default) return null;

    return {
      ...routeInfo,
      component: module.default,
      layoutPaths: findLayoutPaths(filePath, layoutFiles),
      originalFilePath: filePath,
    };
  })
  .filter((route): route is Route => route !== null)
  .sort((a, b) => {
    const depthA = a.path.split("/").length;
    const depthB = b.path.split("/").length;
    if (depthA !== depthB) return depthB - depthA;
    return a.path.includes(":") ? 1 : b.path.includes(":") ? -1 : 0;
  });

export const Router: React.FC<PropsWithChildren<object>> = ({ children }) => {
  const getAppLocation = useCallback(() => {
    return {
      pathname: stripBasePath(window.location.pathname),
      searchParams: new URLSearchParams(window.location.search),
    };
  }, []);

  const [location, setLocation] = useState(getAppLocation());

  useEffect(() => {
    const handlePopState = () => {
      setLocation(getAppLocation());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [getAppLocation]);

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin);
    const appRelativePath = url.pathname + url.search;
    const fullPath = constructFullPath(appRelativePath);

    window.history.pushState({}, "", fullPath);
    setLocation({
      pathname: stripBasePath(url.pathname),
      searchParams: url.searchParams,
    });
    window.scrollTo(0, 0);
  }, []);

  const matchRoute = useCallback((pathname: string): RouteMatch | null => {
    for (const route of routes) {
      const match = pathname.match(route.regex);
      if (match) {
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, index) => {
          params[name] = decodeURIComponent(match[index + 1]);
        });
        return { route, params };
      }
    }
    return null;
  }, []);

  const matched = useMemo(
    () => matchRoute(location.pathname),
    [location.pathname, matchRoute],
  );

  const contextValue = useMemo(
    () => ({
      pathname: location.pathname,
      params: matched?.params ?? {},
      searchParams: location.searchParams,
      navigate,
    }),
    [location.pathname, location.searchParams, matched?.params, navigate],
  );

  const renderLayouts = useCallback(
    (layoutPaths: string[], pageElement: React.ReactNode): React.ReactNode => {
      if (layoutPaths.length === 0) {
        return pageElement;
      }

      const [currentLayoutPath, ...remainingLayoutPaths] = layoutPaths;
      const LayoutComponent = layoutFiles[currentLayoutPath]?.default;

      if (!LayoutComponent) {
        console.warn(
          `Layout component not found for path: ${currentLayoutPath}`,
        );
        return renderLayouts(remainingLayoutPaths, pageElement);
      }

      return (
      // @ts-expect-error ignore
        <LayoutComponent>
          {renderLayouts(remainingLayoutPaths, pageElement)}
        </LayoutComponent>
      );
    },
    [],
  );

  let content: React.ReactNode;
  if (matched) {
    const PageComponent = matched.route.component;
    const pageElement = <PageComponent />;
    content = renderLayouts(
      [...matched.route.layoutPaths].reverse(),
      pageElement,
    );
  } else {
    if (NotFoundPage) {
      content = <NotFoundPage />;
      if (RootLayout) {
        // @ts-expect-error ignore
        content = <RootLayout>{content}</RootLayout>;
      }
    } else {
      content = <div>404 - Page Not Found: {location.pathname}</div>;
      if (RootLayout) {
      // @ts-expect-error ignore
        content = <RootLayout>{content}</RootLayout>;
      }
    }
  }

  return (
    <RouterContext.Provider value={contextValue}>
      {content ?? children}
    </RouterContext.Provider>
  );
};
