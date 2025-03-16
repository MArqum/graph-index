"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the Ethereum-Subindex-Page component
const CreateSubindex = dynamic(
  () => import("./Ethereum-Subindex-Page/Ethereum-Subindex-Page"), 
  { ssr: false } // Disable server-side rendering
);

const Page = () => {
  return (
    <Suspense fallback={<div>Loading Ethereum Subindex Page...</div>}>
      <CreateSubindex />
    </Suspense>
  );
};

export default Page;
