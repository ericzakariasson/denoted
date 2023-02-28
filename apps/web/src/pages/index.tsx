import { Sidebar } from "ui";
import Header from "../components/Header";
import { useAccount } from "wagmi";
import { authenticateCompose } from "../lib/compose";
import { DocumentList } from "../components/DocumentList";

export default function Web() {
  const { isConnected } = useAccount();
  const isAuthenticated =
    typeof localStorage === "undefined" ? false : localStorage.getItem("did");
  return (
    <>
      <Header />
      <main className="pl-64">
        {isConnected && (
          <button onClick={() => authenticateCompose()} type="button">
            authenticate composedb
          </button>
        )}
        {isAuthenticated && <DocumentList />}
      </main>
    </>
  );
}
