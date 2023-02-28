import { Card, Navbar } from "ui";
import { useAccount } from "wagmi";
import { authenticateCompose } from "../lib/compose";
import { DocumentList } from "../components/DocumentList";

const draftData = [
  {
    id: 1,
    title: "some random titles",
    author: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
    timestamp: 1677538898,
  },
  { id: 2, title: "some titles", author: "yanneth.eth", timestamp: 1677534398 },
  { id: 3, title: "some ", author: "yanneth.eth", timestamp: 1677538538 },
  {
    id: 4,
    title: "some random titles",
    author: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
    timestamp: 332937464923,
  },
  {
    id: 5,
    title: "some random titles",
    author: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
    timestamp: 1677538898,
  },
  {
    id: 6,
    title: "some random titles",
    author: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
    timestamp: 1677538898,
  },
];

export default function Web() {
  const { isConnected } = useAccount();
  const isAuthenticated =
    typeof localStorage === "undefined" ? false : localStorage.getItem("did");
  return (
    <>
      <Navbar />
      <main className="p-20">
        {isConnected && (
          <button onClick={() => authenticateCompose()} type="button">
            authenticate composedb
          </button>
        )}
        <div className="flex flex-wrap justify-between">
          {draftData.map((data) => (
            <div key={data.id} className="mb-4 w-full px-2 sm:w-1/2 lg:w-1/3">
              <Card
                title={data.title}
                timeStamp={data.timestamp}
                author={data.author}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
