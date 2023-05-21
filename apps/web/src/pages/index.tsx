import { GetStaticProps, NextPage } from "next";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "react-query";
import { Logo } from "../components/Logo";
import { Viewer } from "../components/Viewer";
import { COMMANDS } from "../components/commands";
import { Badge } from "../components/ui/badge";
import { Button, buttonVariants } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { trackEvent } from "../lib/analytics";
import { cn } from "../utils/classnames";
import { DeserializedPage } from "../utils/page-helper";
import * as Form from "@radix-ui/react-form";
import { Input } from "../components/ui/input";
import { Loader2 } from "lucide-react";

type Example = {
  title: string;
  description: string;
  cid: string;
};

export const USE_CASE_EXAMPLES: Example[] = [
  {
    title: "Envision your Blockchain News and Product Updates", // Momoka
    cid: "QmUr5sygQ8tG8wkVS3EaMn2JvB83nsj1deQeFkA8ack8na",
    description:
      "Seamlessly compose your insights on our platform and share them with the global crypto community. Join the conversation and share your expertise on emerging web3 technologies.",
  },
  {
    title: "Elevate your Blockchain Analytics", // USDC
    description:
      "Our platform fosters an effortless exploration into your blockchain analytics. Craft your analyses and visualize them in a user-friendly environment while engaging with others interested in similar web3 narratives.",
    cid: "QmaEZ6NmcpMSDDVzv4cS2Qm8ybd8Vt6AJYkxxHFGg7ZWhd",
  },
  {
    title: "Enhance your DAO proposals", // ENS
    cid: "QmQJzywKkrS5AC7dEAiSsx8mvsWbBHxHW5dJxiqSkMSdKo",
    description:
      "Our platform is designed to support you in creating impactful DAO proposals. Write, refine, and publish while retaining full ownership of your data and ideas.",
  },
];

type Props = {
  examples: (Example & { page: DeserializedPage })[];
};

export const getStaticProps: GetStaticProps = async () => {
  const examples = await Promise.all(
    USE_CASE_EXAMPLES.map(async (example) => {
      const response = await fetch(
        `https://cloudflare-ipfs.com/ipfs/${example.cid}`,
        {
          cache: "force-cache",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Could not fetch page from IPFS with CID ${example.cid}`
        );
      }

      const json = await response.json();

      return {
        ...example,
        page: json,
      };
    })
  );
  return {
    props: {
      examples,
    },
  };
};

const Page: NextPage<Props> = ({ examples }) => {
  const emailSignup = useMutation(async (email: string) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    trackEvent("Email Signed Up");

    return result;
  });

  return (
    <>
      <Head>
        <title>denoted</title>
      </Head>
      <div className="m-auto flex max-w-6xl flex-col items-start gap-24 p-4">
        <header className="flex w-full items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href={{
              pathname: "/create",
            }}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Open App
            {" ->"}
          </Link>
        </header>
        <div className="flex flex-col gap-8">
          <h1 className="max-w-4xl text-6xl font-bold">
            Own your digital creations through the power of decentralization.
          </h1>
          <p className="max-w-3xl">
            {`Embrace the future of content creation with our innovative web3
            authoring application. We are redefining what it means to write in
            the decentralized era, where data ownership, transparency, and user
            experience converge. Unleash your potential in a platform where your
            words, your control, and your privacy come first. It's time to own
            your narrative in Web3.`}
          </p>
          <div className="flex gap-2">
            <Link href="/create" className={cn(buttonVariants({}))}>
              Try now {"->"}
            </Link>
            <Link
              href="https://t.me/+21U-bg0SJAM2MmI0"
              className={cn(buttonVariants({ variant: "link" }))}
              target="_blank"
            >
              Join telegram
            </Link>
          </div>
        </div>
        <section className="flex w-full flex-col gap-8">
          {examples.map((example, i) => {
            const isEven = i % 2 === 0;
            return (
              <article className={cn("flex max-w-full items-center gap-12")}>
                <div
                  className={cn("w-1/2", isEven ? "order-first" : "order-last")}
                >
                  <h1 className="mb-4 text-5xl font-semibold">
                    {example.title}
                  </h1>
                  <p>{example.description}</p>
                </div>
                <div
                  className={cn(
                    "flex aspect-square w-1/2 overflow-scroll rounded-2xl border shadow-md"
                  )}
                >
                  <div className="w-full scale-75">
                    <h1 className="mb-8 text-5xl font-bold leading-tight">
                      {example.page.title}
                    </h1>
                    <Viewer
                      json={{
                        type: "doc",
                        content: example.page.data ?? [],
                      }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </section>
        <section className="flex w-full flex-col gap-8">
          <h1 className="text-5xl font-semibold">Plugins</h1>
          {COMMANDS.map((group) => {
            return (
              <article key={group.name}>
                <h1 className="mb-2 text-lg">{group.name}</h1>
                <ul className="grid grid-cols-3 gap-4">
                  {group.items.map((command) => {
                    return (
                      <li key={command.command}>
                        <Card>
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <CardTitle>{command.title}</CardTitle>{" "}
                              {command.icon && (
                                <Image
                                  {...command.icon}
                                  width={16}
                                  height={16}
                                  alt={"Icon for command"}
                                  className="inline"
                                />
                              )}
                            </div>
                            <CardDescription>
                              {command.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2">
                              <Badge variant={"outline"} className="font-mono">
                                /{command.command}
                              </Badge>
                              <Badge variant={"outline"}>
                                {command.blockType}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </section>
        <section className="flex w-full flex-col gap-8">
          <h1 className="text-5xl font-semibold">Stay up to date</h1>
          <Form.Root
            className="flex w-full max-w-sm items-end gap-2 "
            onSubmit={(event) => {
              event.preventDefault();
              const data = Object.fromEntries(
                new FormData(event.currentTarget)
              );
              emailSignup.mutate(data.email.toString());
            }}
          >
            <Form.Field name="email" className="flex flex-1 flex-col">
              <Form.Message
                match="typeMismatch"
                className="mb-2 text-slate-500"
              >
                please provide a valid email
              </Form.Message>
              <Form.Control asChild>
                <Input
                  type="email"
                  required
                  placeholder="denoted@example.com"
                  disabled={emailSignup.isLoading}
                />
              </Form.Control>
            </Form.Field>
            <Form.Submit asChild>
              <Button disabled={emailSignup.isLoading}>
                {emailSignup.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign up
              </Button>
            </Form.Submit>
          </Form.Root>
          {emailSignup.isSuccess && <p>you are signed up!</p>}
        </section>
      </div>
    </>
  );
};

export default Page;
