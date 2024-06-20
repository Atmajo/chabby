"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Landing = () => {
  return (
    <div className="mt-32 select-none">
      <div>
        <Image src="/eye.svg" width={500} height={500} alt="Eye" />
      </div>
      <h1 className="scroll-m-20 text-4xl text-center font-extrabold tracking-tight lg:text-5xl">
        Getting Started
      </h1>
      <p className="text-lg text-center text-muted mt-5">
        Welcome to Chabby, a chat application built using{" "}
        <span className=" font-bold text-xl">Gemini</span>
      </p>
      <div className="flex justify-center items-center mt-10">
        <Link href="/home">
          <Button
            variant="default"
            className="text-white bg-white bg-opacity-10"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
