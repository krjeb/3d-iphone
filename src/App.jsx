import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Model from "./components/Model";
import Features from "./components/Features";
import Chip from "./components/Chip";

import * as Sentry from "@sentry/react";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <Chip />
    </main>
  );
};

export default Sentry.withProfiler(App);
