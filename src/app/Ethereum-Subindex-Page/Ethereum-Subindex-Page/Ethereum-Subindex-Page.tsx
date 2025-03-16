"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/Navbar/page";
import * as d3 from "d3";

const EthereumSubindexPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    interface QueryData {
        about?: string;
        indexers?: any;
        curators?: any;
        [key: string]: any;
    }

    const [queryData, setQueryData] = useState<QueryData | null>(null);
    const [activeTab, setActiveTab] = useState<keyof typeof exampleCode>("cURL");
    const [activeTabs, setActiveTabs] = useState("Query");

    useEffect(() => {
        const encodedData = searchParams.get("graphData");
        if (encodedData) {
            try {
                const decodedData = JSON.parse(decodeURIComponent(encodedData));
                setQueryData(decodedData);
            } catch (error) {
                console.error("Error parsing graphData:", error);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (queryData && 'nodes' in queryData && 'links' in queryData) {
            drawGraph(queryData as { nodes: Node[]; links: Link[] });
        }
    }, [queryData]);

    const tabs = ["Query", "About", "Indexers", "Curators"];

    interface Node {
        name: string | number | boolean | null;
        type: string;
        id: string;
        x?: number;
        y?: number;
    }

    interface Link {
        source: Node;
        target: Node;
    }

    const drawGraph = (data: { nodes: Node[]; links: Link[] }) => {
        const width = 600;
        const height = 600;

        d3.select("#graph-container").selectAll("svg").remove();

        const svg = d3.select("#graph-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("border-radius", "12px");

        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id((d) => (d as Node).id).distance(120))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX(width / 2).strength(0.1))
            .force("y", d3.forceY(height / 2).strength(0.1));

        const link = svg.selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke", "#888")
            .attr("stroke-width", 1.5);

        const node = svg.selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", (d: Node) => (d.type === "central" ? 20 : 14))
            .attr("fill", (d: Node) => (d.type === "central" ? "#FF8C00" : "#32CD32"))
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .call(drag(simulation) as any);

        const text = svg.selectAll("text")
            .data(data.nodes)
            .join("text")
            .attr("dy", 4)
            .attr("x", 10)
            .attr("font-size", "12px")
            .attr("fill", "#FFF")
            .text((d: Node) => d.name);

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);

            text
                .attr("x", (d: any) => d.x + 10)
                .attr("y", (d: any) => d.y);
        });

        function drag(simulation: any) {
            function dragstarted(event: any, d: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event: any, d: any) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event: any, d: any) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }
    };


    const handleNavigation = () => {
        router.push('/Playground'); // Redirects to the Playground page
    };

    const exampleCode = {
        cURL: `
    >_ bash
    curl -X POST \\
    -H "Content-Type: application/json" \\
    -d '{"query": "{ factories(first: 5) { id poolCount txCount totalVolumeUSD } }"}' \\
    https://api.graphRAG.com/api/api-key/subindexes/id/5zvR82Q0aXYFyDEKLZ9t6v9adgnptvYpKsBxtqVENFV
        `,
        React: `
    import axios from 'axios';
    
    const fetchData = async () => {
        const response = await axios.post("https://api.graphRAG.com/api/api-key", {
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
            fetch("https://api.graphRAG.com/api/api-key", {
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
        const response = await fetch("https://api.graphRAG.com/api/api-key", {
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
                        <h1 className="text-2xl font-semibold">Ethereum Transactions Subindex</h1><br />
                        <p className="text-gray-400 mt-1 text-sm">Aggregates and indexes Ethereum transactions, allowing users to query by sender, receiver, amount, and timestamp.</p><br />
                        <p className="text-gray-500 text-sm mt-1">⚡ Queries: 12.4k | Updated a year ago</p>
                        <div className="mt-6 flex items-center justify-center text-gray-400 font-semibold text-sm">
                            <span>PROVIDER <br />
                                QuickNode</span>
                            <span className="mx-4 text-white">|</span>
                            <span>QUERY ENDPOINT <br />
                                https://api.Graph...</span>
                            <span className="mx-4 text-white">|</span>
                            <span>GRAPHQL PLAYGROUND LINK<br />
                                https://playground.graph... </span>
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
                        className={`py-2 border-b-2 transition ${
                            activeTab === page ? "text-white border-white" : "text-gray-400 border-transparent hover:text-white hover:border-white"
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
            <div className="p-8 grid grid-cols-4 gap-6">
                <div className=" p-4 rounded-lg">
                    <h2 className="text-xl font-bold">Query Quick Start</h2>
                    <p className="text-gray-400 mt-2 text-sm">The production URL for querying this Subindex on the decentralized network.</p>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Query URL Format</span>
                            <span className="text-gray-500">[project-name]</span>
                        </div>
                        <div className="mt-2 p-2 rounded-lg text-sm">https://api.graphql.io/subgraphs/name/ethereum</div>
                    </div>
                </div>

                {/* API Key and Query Endpoint Section */}
                <div className=" p-4 rounded-lg col-span-3">
                    <h2 className="text-xl font-bold">API Key and Query Endpoint</h2>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm border-b border-gray-700 p-2">
                            <span className="text-gray-400">API Key</span>
                            <button className="text-white p-2 text-xs bg-[#1E1E1E] rounded-lg">See your API key</button>
                        </div>
                        <div className="flex justify-between whitespace-nowrap mt-2 border-b border-gray-700 p-2">
                            <span className="text-gray-400">Query Endpoint</span>
                            <div className=" p-2 text-sm">https://api.thegraph.com/subgraph/name/ethere...</div>
                        </div>
                        <div className="flex justify-between whitespace-nowrap mt-2">
                            <span className="text-gray-400">GraphQL Playground Link</span>
                            <div className=" p-2 underline text-sm">5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV</div>
                        </div>
                        <div className="bg-[#1E1E1E] rounded-lg text-sm mt-4 w-full">
                            <div className="flex border-b border-gray-700 p-3">
                                <span className='text-gray-500'>Query URL format</span>
                            </div>
                            <div className="p-4">
                                <pre className="text-gray-400 text-wrap">
                                    {'https://api.GraphRAG.com/subindexes/name/ethereum/'}
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

            <div className="p-8">
                <h2 className="text-xl font-bold">Documentation</h2>
                <div className="p-8 grid grid-cols-3 gap-6">
                    <div className="bg-[#1E1E1E] p-4 rounded-lg text-sm">
                        <h3 className="font-bold">How to Query Subindexes</h3>
                        <p className="text-gray-400 mt-2">Query Subindexes using multiple languages.</p>
                    </div>
                    <div className="bg-[#1E1E1E] p-4 rounded-lg text-sm">
                        <h3 className="font-bold">Querying Best Practices</h3>
                        <p className="text-gray-400 mt-2">Learn how to optimize queries made from your application.</p>
                    </div>
                    <div className="bg-[#1E1E1E] p-4 rounded-lg text-sm">
                        <h3 className="font-bold">Understanding Schema & Data Structure</h3>
                        <p className="text-gray-400 mt-2">Learn how subindex schemas are structured and how to interpret the data they return.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default EthereumSubindexPage;
