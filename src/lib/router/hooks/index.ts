import { useContext, useMemo } from "react";
import { RouterContext } from "../context";
import type { RouterContextProps } from "../types";

/** Hook to access router context (pathname, params, searchParams, navigate) */
export const useRouter = (): RouterContextProps => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a Router provider");
  }
  return context;
};

/** Hook to access route parameters */
export const useParams = (): Record<string, string> => {
  const { params } = useRouter();
  return params;
};

/** Hook to access URL search parameters */
export const useSearchParams = (): URLSearchParams => {
  const { searchParams } = useRouter();
  return useMemo(() => searchParams, [searchParams]);
};
