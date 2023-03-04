import { useRouter } from "next/router";
import { NextPage } from "next/types";

import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useAccount } from "wagmi";
import { Editor } from "../components/Editor";
import { createNote } from "../composedb/note";
import { authenticateCompose } from "../lib/compose";

function getDid() {
  return typeof localStorage === "undefined"
    ? null
    : localStorage.getItem("did");
}

const CreatePage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { isConnected } = useAccount();

  const router = useRouter();

  const [isAuthenticated, setAuthenticated] = useState(() => Boolean(getDid()));

  async function handleAuthenticate() {
    await authenticateCompose();
    setAuthenticated(true);
  }

  const { mutate, isLoading } = useMutation(
    async () => {
      return await createNote(title, content, new Date().toISOString());
    },
    {
      onSuccess: (data) => {
        console.log(data);
        const id = data.data?.createNote?.document?.id ?? null;
        if (id) {
          router.push(id);
        }
      },
    }
  );

  const isEnabled = isAuthenticated && title.length > 0 && content.length > 0;

  const handleSubmit = () => {
    mutate();
  };

  return (
    <div>
      {isConnected && !isAuthenticated && (
        <div className="mb-8 flex w-full flex-col items-center justify-center gap-3 rounded-2xl bg-gray-100 p-6">
          <p className="max-w-sm text-center text-gray-500">
            You need to sign in with ethereum to ceramic before you can create a
            document
          </p>
          <button
            onClick={handleAuthenticate}
            type="button"
            className="rounded-full border border-black px-2"
          >
            sign in
          </button>
        </div>
      )}
      {!isConnected && (
        <div className="mb-8 flex w-full flex-col items-center justify-center gap-3 rounded-2xl bg-gray-100 p-6">
          <p className="max-w-sm text-center text-gray-500">
            You need to connect before creating a document
          </p>
        </div>
      )}
      <div className="mb-4">
        <input
          placeholder="Untitled"
          className="mb-4 w-full text-5xl font-bold placeholder:text-gray-200 focus:outline-none"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <Editor
          onUpdate={(json) => setContent(JSON.stringify(JSON.stringify(json)))}
        />
      </div>
      <button
        className="rounded-full border border-black bg-black px-2 text-white disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!isEnabled}
      >
        {isLoading ? "saving" : "save"}
      </button>
    </div>
  );
};

export default CreatePage;
