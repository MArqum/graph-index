"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/Navbar/page";
import * as d3 from "d3";

const EthereumSubindexPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [currentUrl, setCurrentUrl] = useState("");

    interface Node {
        fy: number | null;
        fx: number | null;
        name: string | number | boolean | null;
        type: string;
        id: string;
        x?: number;
        y?: number;
    }

    interface Link {
        source: string | Node;
        target: string | Node;
    }

    interface Indexer {
        id: string;
        name: string;
        stake: number;
    }

    interface Curator {
        id: string;
        name: string;
        tokens: number;
    }

    interface QueryData {
        about?: string;
        indexers?: Indexer[]; // Specify the expected structure
        curators?: Curator[]; // Specify the expected structure
        nodes?: Node[];
        links?: Link[];
        [key: string]: unknown; // Use `unknown` instead of `any`
    }

    interface GraphNode {
        id: string;
        type: string;
        index: number;
        x: number;
        y: number;
        vx: number;
        vy: number;
      }
      
      interface GraphLink {
        source: GraphNode;
        target: GraphNode;
        index: number;
      }
      
      interface GraphData {
        _id: string;
        chatId: string;
        selectedProvider: string;
        createdAt: string;
        nodes: GraphNode[];
        links: GraphLink[];
        endpoint?: string; // Added the missing 'endpoint' property
        indexName?:string;
      }

    const [queryData, setQueryData] = useState<QueryData | null>(null);
    const [activeTab, setActiveTab] = useState<keyof typeof exampleCode>("cURL");
    const [activeTabs, setActiveTabs] = useState("Query");
    const [showPopup, setShowPopup] = useState(false);
    const [dynamicApiUrl, setDynamicApiUrl] = useState("");
    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [indexName, setIndexName] = useState<string | null>(null);
    const [endpoint, setEndpoint] = useState<string | null>(null);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const apiURL= process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    useEffect(() => {
        const graphDataParam = searchParams.get("graphData");
        if (graphDataParam) {
            try {
                const decodedGraphData = JSON.parse(decodeURIComponent(graphDataParam));
                if (decodedGraphData._id) {
                    setDynamicApiUrl(`${apiURL}/api/${apiKey}/subindexes/id/${decodedGraphData._id}`);
                }
            } catch (error) {
                console.error("Error parsing graphData:", error);
            }
        }
    }, [searchParams.get("graphData")]);
    

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        // Fetch graphData from URL
        const graphDataParam = urlParams.get("graphData");
        const indexNameParam = urlParams.get("indexName");
        const endpointParam = urlParams.get("endpoint");
        const selectedProviderParam = urlParams.get("selectedProvider");
      
        if (graphDataParam) {
          try {
            const decodedGraphData: GraphData = JSON.parse(decodeURIComponent(graphDataParam));
            setGraphData(decodedGraphData);
          } catch (error) {
            console.error("Error parsing graphData:", error);
          }
        }
      
        // Set additional parameters
        if (indexNameParam) setIndexName(indexNameParam);
        if (endpointParam) setEndpoint(endpointParam);
        if (selectedProviderParam) setSelectedProvider(selectedProviderParam);
      }, []);


    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    // Shorten the URL to first 15 characters + "..."
    const shortenedUrl =
        currentUrl.length > 25 ? currentUrl.substring(0, 25) + "..." : currentUrl;

        const shortenedEndpoint =
        ((graphData?.endpoint?.length || endpoint?.length) ?? 0) > 25 ? (graphData?.endpoint?.substring(0,25) + "...") || (endpoint ? endpoint.substring(0, 25) + "..." : "Not Provided") : graphData?.endpoint || "Not Provided";
    

        useEffect(() => {
            const encodedData = searchParams.get("graphData");
            const selectedProviderParam = searchParams.get("selectedProvider"); // Get selectedProvider from query params
            if (encodedData) {
                try {
                    const decodedData = JSON.parse(decodeURIComponent(encodedData));
                    setQueryData(decodedData);
                } catch (error) {
                    console.error("Error parsing graphData:", error);
                }
            }
        
            if (selectedProviderParam) {
                setSelectedProvider(selectedProviderParam); // Directly store string instead of converting to number
            }
        }, [searchParams]);

    useEffect(() => {
        if (queryData && 'nodes' in queryData && 'links' in queryData) {
            drawGraph(queryData as { nodes: Node[]; links: Link[] });
        }
    }, [queryData]);

    const tabs = ["Query", "About", "Indexers", "Curators"];

    const drawGraph = (data: { nodes: Node[]; links: Link[] }) => {
        const width = 600;
        const height = 600;

        d3.select("#graph-container").selectAll("svg").remove();

        const svg = d3.select("#graph-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("border-radius", "12px");

        const simulation = d3.forceSimulation<Node>(data.nodes)
            .force("link", d3.forceLink<Node, Link>(data.links.map(link => ({
                source: typeof link.source === "string" ? link.source : link.source.id,
                target: typeof link.target === "string" ? link.target : link.target.id
            })))
                .id((d) => d.id)
                .distance(120))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX(width / 2).strength(0.1))
            .force("y", d3.forceY(height / 2).strength(0.1));

        const link = svg.selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke", "#888")
            .attr("stroke-width", 1.5);

        const node = svg
            .selectAll<SVGCircleElement, Node>("circle") // Explicitly specify the types
            .data(data.nodes)
            .join("circle")
            .attr("r", (d) => (d.type === "central" ? 20 : 14))
            .attr("fill", (d) => (d.type === "central" ? "#FF8C00" : "#32CD32"))
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .call(drag(simulation)); // Ensure correct type compatibility        

        const text = svg.selectAll("text")
            .data(data.nodes)
            .join("text")
            .attr("dy", 4)
            .attr("x", 10)
            .attr("font-size", "12px")
            .attr("fill", "#FFF")
            .text((d) => d.name?.toString() || "");

        simulation.on("tick", () => {
            link
                .attr("x1", (d) => (d.source as Node).x!)
                .attr("y1", (d) => (d.source as Node).y!)
                .attr("x2", (d) => (d.target as Node).x!)
                .attr("y2", (d) => (d.target as Node).y!);

            node
                .attr("cx", (d) => d.x!)
                .attr("cy", (d) => d.y!);

            text
                .attr("x", (d) => d.x! + 10)
                .attr("y", (d) => d.y!);
        });
    };

    function drag(simulation: d3.Simulation<Node, undefined>): d3.DragBehavior<SVGCircleElement, Node, unknown> {
        return d3.drag<SVGCircleElement, Node>()
            .on("start", (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x ?? null;
                d.fy = d.y ?? null;
            })
            .on("drag", (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }




    const handleNavigation = () => {
        router.push('/Playground'); // Redirects to the Playground page
    };

    const Navigate = () => {
        router.push('/Playground'); // Redirects to the Playground page
    };

    const exampleCode = {
        cURL: `
    >_ bash
    curl -X POST \\
    -H "Content-Type: application/json" \\
    -d '{"query": "{ factories(first: 5) { id poolCount txCount totalVolumeUSD } }"}' \\
    ${dynamicApiUrl}
        `,
        React: `
    import axios from 'axios';
    
    const fetchData = async () => {
        const response = await axios.post("${dynamicApiUrl}", {
            query: "{ factories(first: 5) { id poolCount txCount totalVolumeUSD } }"
        });
        console.log(response.data);
    };
    
    fetchData();
        `,
        NextJS: `
    import { useEffect, useState } from 'react';
    
    export default function Home() {
        const [data, setData] = useState(null);
    
        useEffect(() => {
            fetch("${dynamicApiUrl}", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: "{ factories(first: 5) { id poolCount txCount totalVolumeUSD } }"
                })
            })
            .then(res => res.json())
            .then(data => setData(data));
        }, []);
    
        return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }
        `,
        Node: `
    const fetch = require('node-fetch');
    
    async function fetchData() {
        const response = await fetch("${dynamicApiUrl}${indexName}", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: "{ factories(first: 5) { id poolCount txCount totalVolumeUSD } }"
            })
        });
        const data = await response.json();
        console.log(data);
    }
    
    fetchData();
        `
    };


    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white font-sans">
            {/* External Navbar */}
            <Navbar />

            {/* Heading Section */}
            <div className="p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-semibold">{graphData?.indexName || indexName || 'not provided'}</h1><br />
                        <p className="text-gray-400 mt-1 text-sm">Aggregates and indexes Ethereum transactions, allowing users to query by sender, receiver, amount, and timestamp.</p><br />
                        <p className="text-gray-500 text-sm mt-1">⚡ Queries: 12.4k | Updated a year ago</p>
                        <div className="mt-6 flex items-center justify-center text-gray-400 font-semibold text-sm">
                            <span>PROVIDER <br />
                                {selectedProvider}
                            </span>

                            <span className="mx-4 text-white">|</span>
                            <span>
                                QUERY ENDPOINT <br />
                                <a
                                    href={graphData?.endpoint}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    {shortenedEndpoint}
                                </a>
                            </span>
                            <span className="mx-4 text-white">|</span>
                            <span>
                                GRAPHQL PLAYGROUND LINK<br />
                                <a
                                    href={currentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    {shortenedUrl}
                                </a>
                            </span>

                            <span className="mx-4 text-white">|</span>
                            <span>QUERY DOCUMENTATION<br />
                            </span>
                        </div>
                        <div className="flex items-center mt-3">
                            <span className="bg-green-400 text-black px-2 py-1 text-xs rounded-full">🟢 LIVE</span>
                            <span className="ml-2 text-gray-400 text-sm">Progress: 100%</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
                            <option>v0.0.3</option>
                            <option>v0.0.2</option>
                        </select>
                        <button
                            onClick={handleNavigation}
                            className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-600 text-sm">🚀 Test Index</button>
                    </div>
                </div>
            </div>

            {/* Page Navigation */}
            <div className="flex space-x-6 border-b border-gray-800 px-8 text-sm">
                {tabs.map((page) => (
                    <button
                        key={page}
                        onClick={() => setActiveTabs(page)}
                        className={`py-2 border-b-2 transition ${activeTab === page ? "text-white border-white" : "text-gray-400 border-transparent hover:text-white hover:border-white"
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Query Page Content */}
            <div className="p-8 grid grid-cols-2 gap-6">
                {/* Left View (Dynamic Content) */}
                <div className="bg-[#1E1E1E] p-4 rounded-lg h-96 overflow-y-auto text-sm">
                    {activeTabs === "Query" && (
                        <pre>{JSON.stringify(queryData, null, 2) || "No Data Loaded"}</pre>
                    )}
                    {activeTabs === "About" && (
                        <div>
                            <h2 className="text-xl font-bold">About Ethereum Subindex</h2>
                            <p className="text-gray-400 mt-2">
                                {queryData?.about || "No About Data Available"}
                            </p>
                        </div>
                    )}
                    {activeTabs === "Indexers" && (
                        <div>
                            <h2 className="text-xl font-bold">Indexers</h2>
                            <pre className="text-gray-400 mt-2">
                                {queryData?.indexers ? JSON.stringify(queryData.indexers, null, 2) : "No Indexers Data Available"}
                            </pre>
                        </div>
                    )}
                    {activeTabs === "Curators" && (
                        <div>
                            <h2 className="text-xl font-bold">Curators</h2>
                            <pre className="text-gray-400 mt-2">
                                {queryData?.curators ? JSON.stringify(queryData.curators, null, 2) : "No Curators Data Available"}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Right Graph View (Always the Same) */}
                <div id="graph-container" className="bg-[#1E1E1E] p-4 rounded-lg h-96 flex justify-center items-center text-sm">
                    {!queryData && <p className="text-gray-400">[Graph Visualization Placeholder]</p>}
                </div>
            </div>

            {/* Query Quick Start */}
            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Query Quick Start */}
                <div className="p-4 rounded-lg bg-[#1E1E1E]">
                    <h2 className="text-lg sm:text-xl font-bold">Query Quick Start</h2>
                    <p className="text-gray-400 mt-2 text-sm">
                        The production URL for querying this Subindex on the decentralized network.
                    </p>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-400">Query URL Format</span>
                            <span className="text-gray-500 truncate">[Web3 Graph Index]</span>
                        </div>
                        <div className="mt-2 p-2 bg-gray-900 rounded-lg text-xs sm:text-sm break-all">
                        <a
                                    href={graphData?.endpoint}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    {graphData?.endpoint || endpoint}
                                </a>
                        </div>
                    </div>
                </div>

                {/* API Key and Query Endpoint Section */}
                <div className="p-4 rounded-lg bg-[#1E1E1E] col-span-1 sm:col-span-2 lg:col-span-3">
                    <h2 className="text-lg sm:text-xl font-bold">API Key and Query Endpoint</h2>
                    <div className="mt-4">
                        {/* API Key */}
                        <div className="relative flex justify-between text-xs sm:text-sm border-b border-gray-700 p-2">
            <span className="text-gray-400">API Key</span>
            <button
                className="text-white p-2 text-xs bg-gray-800 rounded-lg"
                onClick={() => setShowPopup(!showPopup)}
            >
                See your API key
            </button>

            {showPopup && (
                <div className="absolute top-10 right-0 bg-gray-900 text-white p-3 rounded-md shadow-lg border border-gray-700 text-xs">
                    {process.env.NEXT_PUBLIC_OPENAI_API_KEY || "API Key not available"}
                </div>
            )}
        </div>

                        {/* Query Endpoint */}
                        <div className="flex justify-between whitespace-nowrap mt-2 border-b border-gray-700 p-2 text-xs sm:text-sm">
                            <span className="text-gray-400">Query Endpoint</span>
                            <div className="p-2 truncate"><a
                                    href={graphData?.endpoint}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    {graphData?.endpoint || endpoint}
                                </a></div>
                        </div>

                        {/* GraphQL Playground Link */}
                        <div className="flex justify-between whitespace-nowrap mt-2 text-xs sm:text-sm">
                            <span className="text-gray-400">GraphQL Playground Link</span>
                            <div
                            onClick={Navigate}
                            className="p-2 underline break-all cursor-pointer">
                                PlayGround
                            </div>
                        </div>

                        {/* Query URL Box */}
                        <div className="bg-gray-900 rounded-lg text-xs sm:text-sm mt-4 w-full">
                            <div className="flex border-b border-gray-700 p-3">
                                <span className="text-gray-500">Query URL format</span>
                            </div>
                            <div className="p-4 break-all">
                                <pre className="text-gray-400">
                                <a
                                    href={graphData?.endpoint}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    {graphData?.endpoint || endpoint}
                                </a>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Example Usage and Documentation */}
            <div className="p-8">
            <h2 className="text-xl font-bold">Example usage</h2>
            <div className="bg-[#1E1E1E] rounded-lg text-sm mt-4 w-full">
                <div className="flex border-b border-gray-700">
                    {Object.keys(exampleCode).map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 ${activeTab === tab ? "bg-gray-800 text-blue-400" : "text-gray-400"}`}
                            onClick={() => setActiveTab(tab as keyof typeof exampleCode)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="p-4">
                    <pre className="text-gray-400 text-wrap">
                        {exampleCode[activeTab]}
                    </pre>
                </div>
            </div>
        </div>

            <div className="p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-bold">Documentation</h2>
                <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-[#1E1E1E] p-4 rounded-lg text-sm">
                        <h3 className="font-bold">How to Query Subindexes</h3>
                        <p className="text-gray-400 mt-2">Query Subindexes using multiple languages.</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#1E1E1E] p-4 rounded-lg text-sm">
                        <h3 className="font-bold">Querying Best Practices</h3>
                        <p className="text-gray-400 mt-2">Learn how to optimize queries made from your application.</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#1E1E1E] p-4 rounded-lg text-sm">
                        <h3 className="font-bold">Understanding Schema & Data Structure</h3>
                        <p className="text-gray-400 mt-2">
                            Learn how subindex schemas are structured and how to interpret the data they return.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}


export default EthereumSubindexPage;
