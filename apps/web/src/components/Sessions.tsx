import { useCeramic } from "../hooks/useCeramic";
import { composeClient } from "../lib/compose";
import { useEffect } from "react";

export function InitializeCeramic() {
  const ceramic = useCeramic(composeClient);

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
