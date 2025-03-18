"use client";

import dynamic from 'next/dynamic';

const PlayGround = dynamic(() => import('./Playground/Playground'), { ssr: false });

const Page = () => {
  return (
    <div>
      <PlayGround />
    </div>
  );
};

export default Page;
