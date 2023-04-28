import { useQuery } from "react-query";
import { trackEvent } from "../lib/analytics";
import { authenticateLit, getIsLitAuthenticated } from "../lib/lit";

export function useLit() {
  async function authenticate() {
    await authenticateLit();
    trackEvent("Lit Authenticated");
    isLitAuthenticatedQuery.refetch();
  }

  const isLitAuthenticatedQuery = useQuery(
    ["LIT", "AUTHENTICATED"],
    async () => {
      return getIsLitAuthenticated();
    },
    { cacheTime: 0 }
  );

  return {
    authenticate,
    isLitAuthenticated: isLitAuthenticatedQuery.data ?? false,
    isLoading: isLitAuthenticatedQuery.isLoading,
  };
}
