import { NextPage } from "next";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { COMMANDS } from "../components/commands";
import Link from "next/link";

import * as Form from "@radix-ui/react-form";
import { useMutation } from "react-query";

type Props = {};

const Page: NextPage<Props> = ({}) => {
  const commands = COMMANDS.map((c) => c.command);

  const [index, setIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timer | null>(null);

  const onTick = useCallback(() => {
    setIndex((i) => (i + 1) % commands.length);
  }, [commands.length]);

  useEffect(() => {
    timerRef.current = setInterval(onTick, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onTick]);

  const command = commands[index];

  const emailSignup = useMutation(async (email: string) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    return result;
  });

  return (
    <div className="flex flex-col items-center gap-8 pt-32">
      <h1 className="text-2xl">start creating with</h1>
      <Link
        href="/create"
        className="flex rounded-[64rem] border-4 border-black px-12 py-6"
      >
        <span className="text-6xl">
          /{/* <AnimatePresence mode="popLayout"> */}
          <motion.span
            key={command}
            animate={{
              y: "-1.5",
              transition: { type: "spring", stiffness: 400, damping: 35 },
            }}
            exit={{
              y: "1.5em",
              transition: { type: "spring", stiffness: 400, damping: 35 },
            }}
            initial={{ y: "1.5em" }}
          >
            {command}
          </motion.span>
          {/* </AnimatePresence> */}
        </span>
      </Link>
      <p className="max-w-xs text-center text-gray-500">
        a knowledge management editor that visualizes on-chain data
      </p>
      <div className="flex w-full max-w-2xl flex-col items-center gap-4 rounded-[3rem] bg-gray-100 py-16 px-20">
        <p className="text-xl font-medium">
          be the first to know when we launch
        </p>
        <Form.Root
          className="flex w-full items-end"
          onSubmit={(event) => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(event.currentTarget));
            emailSignup.mutate(data.email.toString());
          }}
        >
          <Form.Field name="email" className="flex w-full flex-col">
            <Form.Message match="typeMismatch" className="mb-2 text-gray-500">
              please provide a valid email
            </Form.Message>
            <Form.Control asChild>
              <input
                className="h-[42px] rounded-l-3xl"
                type="email"
                required
                placeholder="denoted@example.com"
                disabled={emailSignup.isLoading}
              />
            </Form.Control>
          </Form.Field>
          <Form.Submit asChild>
            <button
              className="h-[42px] w-[96px] rounded-r-full bg-black px-4 py-1 text-lg text-white"
              disabled={emailSignup.isLoading}
            >
              {emailSignup.isLoading ? "..." : "/signup"}
            </button>
          </Form.Submit>
        </Form.Root>
        {emailSignup.isSuccess && <p>you are signed up!</p>}
      </div>
    </div>
  );
};

export default Page;
