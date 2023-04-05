import dynamic from "next/dynamic";

const GetStarted = dynamic(
  () => import("../components/GetStarted").then((module) => module.GetStarted),
  {
    ssr: false,
  }
);

export default function Page() {
  return <GetStarted />;
}
