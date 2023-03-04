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

  const { isConnected, address } = useAccount();
  const isAuthenticated =
    typeof localStorage === "undefined" ? false : localStorage.getItem("did");

  const router = useRouter();

  useEffect(() => {
    authenticateCompose();
  }, [address]);

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
      {isConnected && (
        <button onClick={authenticateCompose} type="button">
          authenticate composedb
        </button>
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
          onUpdate={(json) =>
            setContent(JSON.stringify(json).replace(/\\"/g, '"'))
          }
          initialContent={`
          asdad
          <iframe src="https://dune.com/embeds/1909661/3144730" frameborder="0" allowfullscreen></iframe>

          `}
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
