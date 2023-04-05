import Link from "next/link";
import { PropsWithChildren } from "react";
import { useMutation } from "react-query";
import { useAccount, useConnect } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { identify, trackEvent } from "../lib/analytics";
import { cn } from "../utils/classnames";

type GetStartedStepProps = PropsWithChildren<{
  step: number;
  title: string;
  description: string;
  completed: boolean;
}>;

function GetStartedStep({
  step,
  title,
  description,
  completed,
  children,
}: GetStartedStepProps) {
  return (
    <li className="flex gap-4">
      <span
        className={cn(
          "block h-8 w-8 flex-shrink-0 rounded-lg bg-gray-100 text-center font-medium leading-8 text-gray-500",
          completed && "bg-green-400 text-white"
        )}
      >
        {step}
      </span>
      <div className="flex flex-col items-start gap-4">
        <div className="gap-2">
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>
          <p className="text-gray-500">{description}</p>
        </div>
        {children}
      </div>
    </li>
  );
}

const fromGetStarted = {
  from: "Get started",
};

export function GetStarted() {
  const { isConnected } = useAccount();
  const { connect, isLoading, connectors } = useConnect({
    onSuccess: (data) => {
      identify(data.account);
      trackEvent("Wallet Connected", {
        chainId: data.chain.id,
        ...fromGetStarted,
      });
    },
  });

  const ceramic = useCeramic();
  const lit = useLit();

  const authenticateCeramicMutation = useMutation(
    async () => {
      return await ceramic.authenticate();
    },
    {
      onMutate: () => {
        trackEvent("Ceramic Authenticate Clicked", fromGetStarted);
      },
    }
  );

  const authenticateLitMutation = useMutation(
    async () => {
      return await lit.authenticate();
    },
    {
      onMutate: () => {
        trackEvent("Lit Authenticate Clicked", fromGetStarted);
      },
    }
  );

  return (
    <div className="mb-2 rounded-3xl">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">Get started</h1>
      <ul className="flex flex-col gap-12">
        <GetStartedStep
          step={1}
          title="Connect wallet"
          description="You need to connect your wallet in order to continue!"
          completed={isConnected}
        >
          <button
            className={cn(
              "rounded-xl from-gray-700 to-gray-900 px-6 py-3 leading-tight text-white enabled:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] enabled:shadow-md disabled:bg-gray-300"
            )}
            disabled={isConnected}
            onClick={() => connect({ connector: connectors[0] })}
          >
            {isLoading ? "Connecting..." : "Connect"}
          </button>
        </GetStartedStep>
        <GetStartedStep
          step={2}
          title="Enable storage of pages"
          description="This ensures the integrity and immutability of your data by proving that you are the owner and authorizing any changes."
          completed={isConnected && ceramic.isComposeResourcesSigned}
        >
          <button
            className={cn(
              "rounded-xl from-gray-700 to-gray-900 px-6 py-3 leading-tight text-white enabled:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] enabled:shadow-md disabled:bg-gray-300"
            )}
            disabled={ceramic.isComposeResourcesSigned || !isConnected}
            onClick={() => authenticateCeramicMutation.mutate()}
          >
            {authenticateCeramicMutation.isLoading
              ? "Waiting..."
              : "Sign message"}
          </button>
        </GetStartedStep>
        <GetStartedStep
          step={3}
          title="Enable private pages"
          description="This ensures that even though your data is stored on the blockchain, it remains private and secure, with only authorized users having access to it."
          completed={
            isConnected &&
            ceramic.isComposeResourcesSigned &&
            lit.isLitAuthenticated
          }
        >
          <button
            className={cn(
              "rounded-xl from-gray-700 to-gray-900 px-6 py-3 leading-tight text-white enabled:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] enabled:shadow-md disabled:bg-gray-300"
            )}
            disabled={
              lit.isLitAuthenticated ||
              !ceramic.isComposeResourcesSigned ||
              !isConnected
            }
            onClick={() => authenticateLitMutation.mutate()}
          >
            {authenticateLitMutation.isLoading ? "Waiting..." : "Sign message"}
          </button>
        </GetStartedStep>
        <GetStartedStep
          step={4}
          title="Create a page!"
          description="Write away!"
          completed={false}
        >
          <Link
            className={cn(
              "rounded-xl bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-gray-700 to-gray-900 px-6 py-3 leading-tight text-white shadow-md",
              (!lit.isLitAuthenticated ||
                !ceramic.isComposeResourcesSigned ||
                !isConnected) &&
                "bg-gray-300"
            )}
            onClick={() =>
              trackEvent("Create Page Link Clicked", fromGetStarted)
            }
            href={"/create"}
          >
            {"Create page ->"}
          </Link>
        </GetStartedStep>
      </ul>
    </div>
  );
}
