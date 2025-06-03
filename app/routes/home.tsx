import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Problem } from "../problem/Problem";
import Hintarea from "~/components/Hintarea";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      {/* <Welcome /> */}
      <div className="display flex">
        <div className="w-5xl">
          <Problem />
        </div>
        <div className="w-sm">
          <Hintarea />
        </div>
      </div>
    </>
  );
}
