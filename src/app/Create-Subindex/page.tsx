"use client";
import dynamic from 'next/dynamic';

const CreateSubindex = dynamic(() => import('./Create-Subindex/Create-Subindex'), { ssr: false });

const Page = () => {
  return (
    <div>
      <CreateSubindex />
    </div>
  );
};

export default Page;
