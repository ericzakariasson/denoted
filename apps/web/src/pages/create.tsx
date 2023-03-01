import { NextPage } from "next/types";
import { doc } from "prettier";
import { useState, useRef } from "react";
import { Editor } from "../components/Editor";
const CreatePage: NextPage = () => {
  const [title, setTitle] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
      className="m-auto max-w-2xl"
    >
      <input
        placeholder="Untitled"
        className="w-full text-6xl font-bold placeholder:text-gray-200"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <div>
        <Editor />
      </div>
      <button>save</button>
    </form>
  );
};

export default CreatePage;
