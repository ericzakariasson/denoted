import { NextPage } from "next/types";

import { useState, useRef } from "react";
import { useMutation } from "react-query";
import { useAccount } from "wagmi";
import { Editor } from "../components/Editor";
import { authenticateCompose } from "../lib/compose";

const CreatePage: NextPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { isConnected } = useAccount();
  const isAuthenticated =
    typeof localStorage === "undefined" ? false : localStorage.getItem("did");

  const { mutate, isLoading } = useMutation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log({ title, content });
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <Editor onUpdate={(json) => setContent(JSON.stringify(json))} />
      <button>{isLoading ? "loading" : "save"}</button>
    </form>
  );
};

export default CreatePage;
