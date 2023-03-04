import { useRouter } from "next/router";
import { NextPage } from "next/types";

import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useAccount } from "wagmi";
import { Editor } from "../components/Editor";
import { createNote } from "../composedb/note";
import { authenticateCompose } from "../lib/compose";

const CreatePage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { isConnected } = useAccount();

  const router = useRouter();

  const [isAuthenticated, setAuthenticated] = useState(
    typeof localStorage === "undefined" ? false : localStorage.getItem("did")
  );

  useEffect(() => {
    function handleStorage() {
      const item = localStorage.getItem("did");

      if (item) {
        setAuthenticated(true);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    authenticateCompose();
  }, []);

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
            onClick={authenticateCompose}
            type="button"
            className="rounded-full border border-black px-2"
          >
            sign in
          </button>
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
