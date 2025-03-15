import type { Route } from "./+types/home";
import { Homepage } from "../homepage/homepage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rhys' Personal Website" },
    { name: "description", content: "Rhys Mistele's website with articles and portfolio content" },
  ];
}

export default function Home() {
  return <Homepage />;
}
