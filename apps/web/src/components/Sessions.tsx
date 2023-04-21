import { useEffect } from "react";
import { useCeramic } from "../hooks/useCeramic";

export function InitializeCeramic() {
  const ceramic = useCeramic();

  useEffect(() => {
    async function run() {
      if (!ceramic.isInitialized && (await ceramic.hasSession())) {
        await ceramic.authenticate();
      }
    }
    run();
  }, [ceramic]);

  return null;
}
