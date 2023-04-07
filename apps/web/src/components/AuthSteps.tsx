import { PropsWithChildren, useRef } from "react";
import { useMutation } from "react-query";
import { useAccount } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useCustomConnect } from "../hooks/useCustomConnect";
import { useLit } from "../hooks/useLit";
import { trackEvent } from "../lib/analytics";
import { cn } from "../utils/classnames";

type AuthStepProps = PropsWithChildren<{
  title: string;
  description: string;
  completed: boolean;
}>;

function AuthStep({ title, description, completed, children }: AuthStepProps) {
  return (
    <li className="flex gap-4">
      <span
        className={cn(
          " flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg  bg-gray-100 text-center font-medium text-gray-500",
          completed && "bg-green-400 text-white"
        )}
      >
        {completed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        )}
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

const fromAuthSteps = {
  from: "Auth Steps Modal",
};

export function AuthSteps() {
  const { isConnected } = useAccount();

  // store the connected state in a ref to prevent it from being removed when connecting from the modal
  const connectedRef = useRef(isConnected);

  const { connect, isLoading, connectors } = useCustomConnect({
    eventProperties: fromAuthSteps,
  });

  const ceramic = useCeramic();
  const lit = useLit();

  const authenticateCeramicMutation = useMutation(
    async () => {
      return await ceramic.authenticate();
    },
    {
      onMutate: () => {
        trackEvent("Ceramic Authenticate Clicked", fromAuthSteps);
      },
    }
  );

  const authenticateLitMutation = useMutation(
    async () => {
      return await lit.authenticate();
    },
    {
      onMutate: () => {
        trackEvent("Lit Authenticate Clicked", fromAuthSteps);
      },
    }
  );

  return (
    <div className="mb-2 rounded-3xl">
      <ul className="flex flex-col gap-12">
        {!connectedRef.current && (
          <AuthStep
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
          </AuthStep>
        )}
        <AuthStep
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
        </AuthStep>
        <AuthStep
          title="Enable private pages"
          description="This ensures that even though your data is stored on the blockchain, it remains private and secure, with only authorized users having access to it."
          completed={isConnected && lit.isLitAuthenticated}
        >
          <button
            className={cn(
              "rounded-xl from-gray-700 to-gray-900 px-6 py-3 leading-tight text-white enabled:bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] enabled:shadow-md disabled:bg-gray-300"
            )}
            disabled={lit.isLitAuthenticated || !isConnected}
            onClick={() => authenticateLitMutation.mutate()}
          >
            {authenticateLitMutation.isLoading ? "Waiting..." : "Sign message"}
          </button>
        </AuthStep>
      </ul>
    </div>
  );
}
