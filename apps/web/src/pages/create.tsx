import { NextPage } from "next/types";

import { useState } from "react";
import { useMutation } from "react-query";
import { useAccount } from "wagmi";
import { Editor } from "../components/Editor";
import { createNote } from "../composedb/note";
import { authenticateCompose } from "../lib/compose";

const CreatePage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { isConnected } = useAccount();
  const isAuthenticated =
    typeof localStorage === "undefined" ? false : localStorage.getItem("did");

  const { mutate, isLoading } = useMutation(
    async () => {
      return await createNote(title, content);
    },
    {
      onSuccess: (data, variables, context) => {
        console.log(data, variables, context);
      },
    }
  );

  const isEnabled = isAuthenticated && !title && !content;

  const handleSubmit = () => {
    mutate();
  };

  return (
    <div>
      {isConnected && !isAuthenticated && (
        <button onClick={() => authenticateCompose()} type="button">
          authenticate composedb
        </button>
      )}
      <input
        placeholder="Untitled"
        className="w-full text-6xl font-bold placeholder:text-gray-200"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <Editor
        onUpdate={(json) =>
          setContent(JSON.stringify(json).replace(/\\"/g, '"'))
        }
      />
      <button
        className="rounded-full border border-black px-2"
        onClick={handleSubmit}
        disabled={!isEnabled}
      >
        {isLoading ? "saving" : "save"}
      </button>
    </div>
  );
};

export default CreatePage;
