import { Sidebar } from "ui";
import Header from "../components/Header";
import { useAccount } from "wagmi";
import { authenticateCompose } from "../lib/compose";

export default function Web() {
  const { isConnected } = useAccount();
  return (
    <>
      <Header />
      <Sidebar />
      <main className="pl-64">
        {isConnected && (
          <button onClick={() => authenticateCompose()} type="button">
            authenticate composedb
          </button>
        )}
      </main>
    </>
  );
}
