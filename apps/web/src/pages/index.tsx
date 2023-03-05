import { NextPage } from "next";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { COMMANDS } from "../components/commands";
import Link from "next/link";

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

  return (
    <div className="flex flex-col items-center gap-8 pt-32">
      <h1 className="text-3xl font-medium">start creating with</h1>
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
        A knowledge management editor that visualizes on-chain data
      </p>
    </div>
  );
};

export default Page;
