"use client"

import { useRouter } from 'next/navigation';
import React from 'react';
import Navbar from '@/app/Navbar/page';

const EthereumSubindexPage = () => {
    const router = useRouter();

    const handleNavigation = () => {
        router.push('/Playground'); // Redirects to the Playground page
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-white font-sans">
        {/* External Navbar */}
        <Navbar />

        {/* Heading Section */}
        <div className="p-8">
            <div className="flex justify-between items-start">
                <div>
                            <h1 className="text-2xl font-semibold">Ethereum Transactions Subindex</h1><br/>
                            <p className="text-gray-400 mt-1 text-sm">Aggregates and indexes Ethereum transactions, allowing users to query by sender, receiver, amount, and timestamp.</p><br/>
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
                    {['Query', 'About', 'Indexers', 'Curators'].map((page) => (
                        <a key={page} href="#" className="text-gray-400 hover:text-white py-2 border-b-2 border-transparent hover:border-white">{page}</a>
                    ))}
                </div>

                {/* Query Page Content */}
                <div className="p-8 grid grid-cols-2 gap-6">
                    {/* Left JSON View */}
                    <div className="bg-[#1E1E1E] p-4 rounded-lg h-96 overflow-y-auto text-sm">
                        <pre className="text-sm">
                            {`{
    "query": {
        "name": "Ethereum Transactions Subindex",
        "schema": {
            "transaction": {
                "id": "String",
                "sender": "String",
                "receiver": "String",
                "amount": "Float",
                "timestamp": "String"
            }
        }
    }
}`}
                        </pre>
                    </div>

                    {/* Right Graph View Placeholder */}
                    <div className="bg-[#1E1E1E] p-4 rounded-lg h-96 flex justify-center items-center text-sm">
                        <p className="text-gray-400">[Graph Visualization Placeholder]</p>
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
                                <span className="text-gray-400">Query Engpoint</span>
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
                            <button className="px-4 py-2 bg-gray-800 text-blue-400">cURL</button>
                            <button className="px-4 py-2 text-gray-400">React</button>
                            <button className="px-4 py-2 text-gray-400">NextJS</button>
                            <button className="px-4 py-2 text-gray-400">Node</button>
                        </div>
                        <div className="p-4">
                            <pre className="text-gray-400 text-wrap">
                                {`>_ bash\n
1 curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{ factories(first: 5) { id poolCount txCount totalVolumeUSD } }", "operationName": "Subindexes", "variables": {}}' \
https://api.graphRAG.com/api/api-key/subindexes/id/5zvR82Q0aXYFyDEKLZ9t6v9adgnptvYpKsBxtqVENFV`}
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
