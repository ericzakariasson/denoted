import { NextPage } from "next";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { COMMANDS } from "../components/commands";
import Link from "next/link";
import Image from "next/image";
import * as Form from "@radix-ui/react-form";
import { useMutation } from "react-query";
import Head from "next/head";
import { trackEvent } from "../lib/analytics";
import { Logo } from "../components/Logo";
import { Button, buttonVariants } from "../components/ui/button";
import { cn } from "../utils/classnames";
import { Loader2, Construction } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

type Props = {};

const Page: NextPage<Props> = ({}) => {
  const commands = COMMANDS.flatMap((c) => c.items.map((item) => item));

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

    trackEvent("Email Signed Up");

    return result;
  });

  return (
    <>
      <Head>
        <title>denoted</title>
      </Head>
      <div className="m-auto flex max-w-2xl flex-col items-start gap-16 p-4">
        <header className="flex w-full items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href={{
              pathname: "/create",
              query: { autofocus: true}
            }}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Open App
            {" ->"}
          </Link>
        </header>
        <Alert>
          <Construction className="h-4 w-4" />
          <AlertTitle>Build in progress!</AlertTitle>
          <AlertDescription>
            {`denoted is in early stages and a lot of development is going on.
            We're currently finalizing the prototype and will be launching soon.
            If you'd like to be notified when we launch, sign up below!`}
          </AlertDescription>
        </Alert>
        <div className="flex w-full max-w-sm flex-col">
          <p className="mb-3">Get notified when we launch</p>
          <Form.Root
            className="flex w-full items-end gap-2"
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
        </div>
        <div>
          <h2 className="mb-3">Editor plugins</h2>
          <div className="grid grid-cols-2 gap-4">
            {commands.map((command, i) => {
              return (
                <Card key={command.command}>
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
                    <CardDescription>{command.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Badge variant={"outline"} className="font-mono">
                        /{command.command}
                      </Badge>
                      <Badge variant={"outline"}>{command.blockType}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
