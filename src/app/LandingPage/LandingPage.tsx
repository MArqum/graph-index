"use client"

import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ArrowDownCircleIcon } from "@heroicons/react/20/solid";
import Navbar from "./Navbar";
import Card from "../../components/ui/card";
import { Play } from "lucide-react";
import { useRouter } from 'next/navigation';



interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => {
  console.log("FeatureCard rendered");
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 opacity-70">{description}</p>
    </div>
  );
};

interface StepCardsProps {
  step: string;
  title: string;
  description: string;
  image?: string;
  code?: string;
  button_text?: string;
}

const StepCards = ({ step, title, description, image, code, button_text }: StepCardsProps) => {
  return (
    <div className="relative p-16 rounded-2xl shadow-md border border-[#1f2937] transition-all duration-300 hover:shadow-blue-500/40 hover:border-blue-500">
      <span className="absolute top-4 text-left left-6 text-sm text-white font-semibold uppercase">{step}</span>
      <h3 className="text-2xl font-semibold text-left mt-3 text-white">{title}</h3>
      <p className="mt-3 text-gray-400 text-left leading-relaxed">{description}</p>

      {/* Centered Image or Code Block */}
      {image ? (
        <img src={image} alt={title} className="mt-6 mx-auto rounded-lg opacity-90 hover:opacity-100 transition block" />
      ) : (
        <pre className="mt-6 p-4 bg-[#1e293b] text-green-400 text-sm rounded-lg shadow-inner border border-[#334155]">
          <code>{code}</code>
        </pre>
      )}

      <button className="mt-6 px-5 py-2 text-sm font-medium top-4 left-6 rounded-lg text-gray-500 transition">
        {button_text}
      </button>
    </div>
  );
};




const LandingPage = () => {

  const router = useRouter();

  const handleRedirect = () => {
    router.push('/Dashboard'); // Redirects to the login page
  };

  return (
    <div className="min-h-screen text-white font-sans relative bg-gradient-to-b from-purple-900 to-black">

      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <section
        className="relative h-screen flex flex-col items-center justify-center dotted-bg text-center px-4"
        style={{
          background: "linear-gradient(210.21deg, #FFCEB0 0%, rgba(112, 35, 195, 0.5) 50%, rgba(0, 0, 0, 0) 70%)",
        }}
      >

        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold">
          Fast, easy access to blockchain data
        </motion.h1>
        <p className="text-lg mt-4 opacity-70">The Graph organizes and serves Web3 data</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}>
          <div className="mt-6 flex items-center justify-center whitespace-nowrap">
          <button
          onClick={handleRedirect}
          className="mt-6 px-6 py-3 rounded-lg bg-primary hover:bg-purple-700 transition flex items-center"
        >
          Start Building <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
            <button className="mt-6 ml-3 px-6 py-3 rounded-lg bg-gray-400 hover:bg-gray-600 text-white transition flex items-center">
              What is the Graph
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 text-center">
        {/* Title with Arrow */}
        <div className="flex items-center justify-center mt-10 space-x-2">
          <h2 className="text-lg font-bold">Explore the Graph</h2>
          <ArrowDownCircleIcon className="w-8 h-8 text-white" />
        </div>

        {/* Gap before cards */}
        <div className="mt-6"></div>

        {/* Feature Cards */}
        <div className="p-14 ml-[100px] mr-[100px] mt-10 grid md:grid-cols-3 gap-[200px]">
          <FeatureCard title="Build Faster 100% less servers" description="Create groundbreaking applications without needing to run your own data server, build indexing infrastructure, or parse through raw data." />
          <FeatureCard title="Spend Less 60-98% less per month" description="Cut down on costs and time spent running expensive infrastructure by tapping into The Graph’s competitive data market." />
          <FeatureCard title="Increase Resilience 99.99% + uptime" description="Ensure your application’s uptime and keep its data flowing 24/7 with a globally distributed network of contributors." />
        </div>

        {/* Light Divider Line */}
        <div className="mt-16 border-t border-gray-700 opacity-50 w-4/5 mx-auto"></div>
      </section>


      {/* Subgraph Section */}
      <section className="py-12 px-4 flex items-center justify-center max-w-7xl mx-auto">
        {/* Left Image */}
        <div className="w-2/5">
          <img src="/img.png" alt="Subgraphs Illustration" className="w-4/5 h-auto mx-auto" />
        </div>

        {/* Right Text Content */}
        <div className="w-3/5 pl-8">
          {/* Styled Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}>

            <h2 className="text-3xl font-bold leading-tight">
              <span className="text-white">S</span>ubgraphs:
              <br />
              <span className="text-gray-400">Industry-Standard Data Access</span>
            </h2>

            {/* Description */}
            <p className="mt-4 text-sm opacity-70">
              Subgraphs are open APIs on The Graph that organize and serve blockchain data to applications.
              Using subgraphs, developers and data consumers alike benefit from speedy access to indexed data.
            </p>
          </motion.div>
          {/* Animated Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}>
            <button className="mt-6 px-6 py-3 rounded-lg bg-primary hover:bg-purple-700 transition">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 mb-36 flex items-center justify-center max-w-5xl mx-auto">
        {/* Left Text Content */}
        <div className="w-3/5 pr-8">
          {/* Animated Heading & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}>

            <h2 className="text-3xl font-bold leading-tight">
              <span className="text-white">W</span>eb3:
              <br />
              <span className="text-gray-400">Powered by subgraphs</span>
            </h2>

            {/* Description */}
            <p className="mt-4 text-sm opacity-70">
              Tens of thousands of developers rely on The Graph to create best-in-class user experiences.
              Explore a rich ecosystem of community-created subgraphs or build your own with The Graph.
            </p>

            {/* Text with Dividers */}
            <div className="mt-6 flex items-center justify-center text-gray-400 font-semibold text-sm">
              <span>100+ <br />
                Indexer Nodes</span>
              <span className="mx-4 text-white">|</span>
              <span>1.27 trillion+ <br />
                Queries Served</span>
              <span className="mx-4 text-white">|</span>
              <span>75K+ <br />
                Projects</span>
            </div>
          </motion.div>
        </div>

        {/* Right Image */}
        <div className="w-2/5">
          <img src="/List.png" alt="Subgraphs Illustration" className="w-4/5 h-auto mx-auto" />
        </div>
      </section>



      {/* Supported Networks */}
      <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Rotating Background */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }} // Smooth continuous rotation
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/MaskGroup.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Content Section (Fixed) */}
        <section className="relative py-16 px-6 text-center flex flex-col items-center justify-center z-10">
          <h2 className="text-3xl font-bold">26+ Supported Networks</h2>
          <p className="mt-4 opacity-70">Join our growing network of blockchain ecosystems.</p>

          <div className="mt-6 flex items-center justify-center whitespace-nowrap">
            <button className="mt-6 ml-3 px-6 py-3 rounded-lg bg-gray-400 hover:bg-gray-600 text-white transition flex items-center">
              Submit a network
            </button>
            <button className="mt-6 ml-3 px-6 py-3 rounded-lg bg-gray-400 hover:bg-gray-600 text-white transition flex items-center">
              Supported networks
            </button>
          </div>
        </section>
      </div>




      {/* How to Use a Subgraph */}
      <section className="py-20 px-6 text-center relative">
        {/* Background overlay (for soft gradient effect) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#1a2332,_#0a0f1c)] opacity-40 pointer-events-none"></div>

        <h2 className="text-4xl font-extrabold text-white">How to use a Subgraph</h2>
        <p className="mt-4 mx-auto max-w-3xl text-lg text-gray-400 opacity-80">
          With The Graph, it’s easy to access blockchain data using subgraphs and GraphQL queries. Join a growing number of trailblazers creating fast, responsive applications with data that loads in milliseconds.
        </p>

        <div className="relative mt-12 grid grid-cols-1 md:grid-cols-3 gap-1 px-6 md:px-16">
          <StepCards
            step="Step 1"
            title="Discover"
            description="Create a subgraph to organize smart contract data, or use an existing one."
            image="/col.png" // Replace with actual image
            button_text="View the subgraph"
          />
          <StepCards
            step="Step 2"
            title="Query"
            description="Easily access organized data with simple GraphQL queries."
            code={`{
  pools (first: 10) {
    address
    annualPercentageReturn
    utilizationRate
    netSize
    netSizeInUsd
    pairName
  }
}`}
            button_text="View the playground"
          />
          <StepCards
            step="Step 3"
            title="Serve"
            description="Effortlessly load queried data into your application."
            image="/col2.png" // Replace with actual image
            button_text="View the dapp"
          />
        </div>
      </section>

      <section className="relative w-full mt-64 h-screen flex flex-col items-center justify-center text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Image.png')" }} // Replace with your image
        ></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          {/* Heading & Paragraph */}
          <h2 className="text-4xl -mt-52 font-bold">Globally distributed <br /> <span className="text-4xl font-bold text-gray-400 opacity-[0.4]"> Decentralized infrastructure</span></h2>
          <p className="mt-4 text-lg opacity-80">
            What makes The Graph so resilient? Enter The Graph Network, a decentralized data market powered by distributed participants: Indexers, Curators, Delegators, and Subgraph Developers.
          </p>

          {/* Centered Image Below Text */}
          <img
            src="/SVG.png" // Replace with actual image
            alt="Visualization"
            className="mt-8 mx-auto"
          />

          {/* Second Heading & Paragraph */}
          <h2 className="text-4xl mt-24 font-bold">Join the ecosystem <br /> <span className="text-4xl font-bold text-gray-400 opacity-[0.4]">Transform the internet</span></h2>
          <p className="mt-4 text-lg opacity-80">
            The Graph ecosystem welcomes you — regardless of where you are in the world, what your level of technical expertise is, or your familiarity with blockchains. Learn about all the roles in which you can choose to participate!
          </p>
        </div>
      </section>


      {/* Global Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-44 max-w-6xl mx-auto text-center">
        <Card>
          <img src="/consumer.png" alt="Consumer" width={50} height={50} className="mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Data Consumer</h3>
          <p className="mt-2 opacity-70">Query an existing subgraph in your project</p>
        </Card>
        <Card>
          <img src="/developer.png" alt="Developer" width={50} height={50} className="mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Developer</h3>
          <p className="mt-2 opacity-70">Create a subgraph to use in your dapp</p>
        </Card>
        <Card>
          <img src="/indexer.png" alt="Indexer" width={50} height={50} className="mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Indexer</h3>
          <p className="mt-2 opacity-70">Index data & serve queries for subgraphs</p>
        </Card>
        <Card>
          <img src="/delegator.png" alt="Delegator" width={50} height={50} className="mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Delegator</h3>
          <p className="mt-2 opacity-70">Secure the network by supporting helpful Indexers</p>
        </Card>
        <Card>
          <img src="/curator.png" alt="Curator" width={50} height={50} className="mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Curator</h3>
          <p className="mt-2 opacity-70">Identify useful subgraphs to index</p>
        </Card>
        <Card>
          <img src="/readmore.png" alt="Read More" width={50} height={50} className="mb-4 mx-auto" />
          <h3 className="text-xl font-bold">Read More</h3>
          <p className="mt-2 opacity-70">23 Ways to Participate in The Graph Ecosystem</p>
        </Card>
      </div>



      <section className="text-center mt-16">
        <h2 className="text-3xl font-bold">Learn more</h2>
        <p className="mt-4 opacity-70">
          The Graph enables innovators of all backgrounds to plug into a collaborative ecosystem.
          Learn more about how The Graph community can serve you.
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto mb-24 mt-10">
          <Card className="bg-[#111] p-6">
            <h4 className="text-lg font-bold">Intro to web3 and The Graph</h4>
            <p className="mt-2 opacity-70">The Graph Foundation • 5 mins read</p>
          </Card>
          <Card className="bg-[#111] p-6">
            <h4 className="text-lg font-bold">About The Graph</h4>
            <p className="mt-2 opacity-70">5 mins read</p>
          </Card>
          <Card className="bg-[#111] p-6 flex items-center gap-4">
            <Play className="text-gray-400" />
            <div>
              <h4 className="text-lg font-bold">How to Delegate GRT</h4>
              <p className="mt-2 opacity-70">20m 30s</p>
            </div>
          </Card>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-8 bg-[#0b0f19] text-center text-xs opacity-60 border-t border-gray-700">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 text-gray-400">
          <span>Home</span>
          <span>Blog</span>
          <span>Jobs</span>
          <span>Docs</span>
          <span>Past Events</span>
        </div>
        <div className="mt-4">© 2025 The Graph. All rights reserved.</div>
      </footer>
    </div>
  );
};
export default LandingPage;