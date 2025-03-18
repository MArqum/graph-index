"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as d3 from "d3";
import { v4 as uuidv4 } from 'uuid';

const dataProviders = [
    { id: "Solana", icon: "/Solana.png", name: "Solana" },
    { id: "Etherium", icon: "/Etherium.png", name: "Etherium" },
];

interface GraphNode {
    id: string;
    name: string;
    type: "central" | "regular";
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

interface GraphLink {
    source: GraphNode | string;
    target: GraphNode | string;
}

const CreateSubindex = () => {
    const router = useRouter();
    const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
    const [step, setStep] = useState(1);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<
        { id: string; sender: "user" | "bot"; text: string }[]
    >([]);
    const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[]; messages?: { text: string }[] }>({
        nodes: [],
        links: [],
    });
    const [activePreview, setActivePreview] = useState<"graph" | "table" | "text" | "code">("graph");
    const apiURL=process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const storedProvider = localStorage.getItem("selectedProvider");
        if (storedProvider) {
            setSelectedProvider(Number(storedProvider));
        }
    }, []);

    const renderPreview = () => {
        const containerStyles = `max-h-[600px] overflow-auto`;
        const scrollbarStyles = {
            scrollbarWidth: 'thin' as 'auto' | 'thin' | 'none', // For Firefox
            scrollbarColor: '#4a4a4a transparent', // Thumb and track color for Firefox
        };

        return (
            <div style={scrollbarStyles}>
                <style jsx>{`
                    /* For Webkit browsers (Chrome, Safari) */
                    div::-webkit-scrollbar {
                        width: 6px;
                    }
                    div::-webkit-scrollbar-thumb {
                        background-color: #4a4a4a;
                        border-radius: 10px;
                    }
                    div::-webkit-scrollbar-track {
                        background: transparent;
                    }
                `}</style>
                {(() => {
                    switch (activePreview) {
                        case 'graph':
                            return (
                                <div className={containerStyles}>
                                    <GraphComponent nodes={graphData.nodes} links={graphData.links} />
                                </div>
                            );
                        case 'table':
                            return (
                                <div className={`text-white ${containerStyles}`}>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr>
                                                <th className="border-b border-gray-700 p-2">ID</th>
                                                <th className="border-b border-gray-700 p-2">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {graphData.nodes.map((node) => (
                                                <tr key={node.id}>
                                                    <td className="border-b border-gray-700 p-2">{node.id}</td>
                                                    <td className="border-b border-gray-700 p-2">{node.type}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        case 'text':
                            return (
                                <pre className={`text-white ${containerStyles} whitespace-pre-wrap`}>
                                    {JSON.stringify(graphData, null, 2)}
                                </pre>
                            );
                        case 'code':
                            return (
                                <code className={`text-green-400 bg-black p-4 rounded-lg block ${containerStyles} whitespace-pre-wrap`}>
                                    {`const graphData = ${JSON.stringify(graphData, null, 2)};`}
                                </code>
                            );
                        default:
                            return null;
                    }
                })()}
            </div>
        );
    };



    const fetchRAGResponse = async (userMessage: string) => {
        try {
            const response = await fetch("http://172.81.127.15:8000/api/rag", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: userMessage,
                    database: "testdb",
                    user_id: "cat10",
                    qa_model_id: "openrouter/deepseek/deepseek-chat",
                    qa_model_kwargs: {
                        api_key: process.env.OPENAI_API_KEY,
                        temperature: 0,
                        max_tokens: 500,
                    },
                }),
            });

            const data = await response.json();
            console.log("Full response from RAG API:", data);

            if (!response.ok) {
                console.error("RAG API Error:", data);
                return "RAG API is currently unavailable. Please try again later.";
            }

            const transactionHashes = data.answer.answer.match(/0x[a-fA-F0-9]{64}/g) || [];
            const address = (data.answer.answer.match(/0x[a-fA-F0-9]{40}/) || [])[0];

            if (address) {
                const nodes = [
                    { id: address, type: "central" },
                    ...transactionHashes.map((tx: string) => ({ id: tx, type: "transaction" })),
                ];

                const links = transactionHashes.map((tx: string) => ({
                    source: tx,
                    target: address,
                }));

                const graphData = { nodes, links };
                setGraphData(graphData);
                console.log("Graph Data:", graphData);
            }

            return data.answer.answer || "No answer provided.";
        } catch (error) {
            console.error("Error fetching RAG response:", error);
            return "There was an error fetching the response. Please try again.";
        }
    };

    const GraphComponent = ({ nodes, links }: { nodes: GraphNode[]; links: GraphLink[] }) => {
        const svgRef = useRef<SVGSVGElement | null>(null);

        useEffect(() => {
            if (!nodes.length || !links.length) return;

            const width = 600;
            const height = 600;

            const svg = d3.select(svgRef.current)
                .attr("width", width)
                .attr("height", height)
                .style("background", "#0D0D0D")
                .style("border-radius", "12px");

            svg.selectAll("*").remove();

            const simulation = d3.forceSimulation<GraphNode>(nodes)
                .force(
                    "link",
                    d3.forceLink<GraphNode, GraphLink>(links)
                        .id((d) => d.id)
                        .distance(120)
                )
                .force("charge", d3.forceManyBody().strength(-300))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("x", d3.forceX(width / 2).strength(0.1))
                .force("y", d3.forceY(height / 2).strength(0.1));

            const link = svg.selectAll("line")
                .data(links)
                .join("line")
                .attr("stroke", "#888")
                .attr("stroke-width", 1.5);

            const node = svg.selectAll<SVGCircleElement, GraphNode>("circle")
                .data(nodes)
                .join("circle")
                .attr("r", (d) => (d.type === "central" ? 20 : 14))
                .attr("fill", (d) => (d.type === "central" ? "#FF8C00" : "#32CD32"))
                .attr("stroke", "#000")
                .attr("stroke-width", 1.5)
                .call(drag(simulation));

            const text = svg.selectAll<SVGTextElement, GraphNode>("text")
                .data(nodes)
                .join("text")
                .attr("dy", 4)
                .attr("x", 10)
                .attr("font-size", "12px")
                .attr("fill", "#FFF")
                .text((d) => d.name);

            simulation.on("tick", () => {
                link
                    .attr("x1", (d) => (typeof d.source === "string" ? 0 : d.source.x!))
                    .attr("y1", (d) => (typeof d.source === "string" ? 0 : d.source.y!))
                    .attr("x2", (d) => (typeof d.target === "string" ? 0 : d.target.x!))
                    .attr("y2", (d) => (typeof d.target === "string" ? 0 : d.target.y!));

                node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
                text.attr("x", (d) => d.x! + 10).attr("y", (d) => d.y!);
            });

            function drag(simulation: d3.Simulation<GraphNode, undefined>) {
                function dragstarted(event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>, d: GraphNode) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }

                function dragged(event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>, d: GraphNode) {
                    d.fx = event.x;
                    d.fy = event.y;
                }

                function dragended(event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>, d: GraphNode) {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }

                return d3.drag<SVGCircleElement, GraphNode>()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended);
            }
        }, [nodes, links]);

        return <svg ref={svgRef}></svg>;
    };

    const getChatId = (): string => {
        // Check if a chatId already exists in local storage
        let chatId = localStorage.getItem('chatId');

        if (!chatId) {
            // Generate a new chatId if no active session exists
            chatId = uuidv4();
            localStorage.setItem('chatId', chatId); // Save it for future use
        }

        return chatId;
    };

    const currentChatId = getChatId();

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: userMessage }]);
        setInput("");

        // Add "Thinking..." message with a unique ID
        const thinkingMessage: { id: string; sender: "user" | "bot"; text: string } = { id: "thinking", sender: "bot", text: "Thinking..." };
        setMessages((prev) => [...prev, thinkingMessage]);

        // Fetch response from RAG API
        const response = await fetchRAGResponse(userMessage);

        console.log(response);


        // Remove "Thinking..." message and add the real response
        setMessages((prev) =>
            prev.filter((msg) => msg.id !== "thinking").concat({ id: Date.now().toString(), sender: "bot", text: response })
        );

        await sendChatToBackend(currentChatId, "user", userMessage); // Save user message
        await sendChatToBackend(currentChatId, "bot", response);     // Save bot response

    };


    const sendChatToBackend = async (chatId: string, sender: 'user' | 'bot', text: string) => {
        try {
            const response = await fetch(`${apiURL}/chats`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatId, sender, text }),
            });

            if (!response.ok) {
                throw new Error("Failed to send chat data to the backend");
            }
            console.log("Message added:", await response.json());
        } catch (error) {
            console.error("Error saving chat to backend:", error);
        }
    };



    const handleNavigation = async () => {
        if (!graphData || !currentChatId) {
            console.error("Graph Data or Chat ID is missing");
            return;
        }
    
        // Get selectedProvider from localStorage
        const selectedProvider = localStorage.getItem("selectedProvider") || "defaultProvider";
    
        // Dynamically create the API endpoint based on the chat ID
        const dynamicEndpoint = `${apiURL}/api/rag/${currentChatId}`;
    
        // Extract the latest user message correctly
        let latestMessage = "General Index"; // Default fallback
        const userMessages = messages.filter((msg) => msg.sender === "user"); // Get only user messages
    
        if (userMessages.length > 0) {
            latestMessage = userMessages[userMessages.length - 1].text || "General Index"; // Last user message
        }
    
        try {
            const response = await fetch(`${apiURL}/graphData`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true" // Bypass ngrok browser warning
                },
                body: JSON.stringify({
                    chatId: currentChatId,
                    createdAt: new Date().toISOString(),
                    selectedProvider: selectedProvider, 
                    nodes: graphData.nodes || [],  // Ensure nodes exist
                    links: graphData.links || [],  // Ensure links exist
                    endpoint: dynamicEndpoint, // Send dynamically generated endpoint
                    indexName: latestMessage, // Store the latest user message as index name
                }),
            });
    
            if (!response.ok) throw new Error("Failed to store Graph Data");
    
            console.log("Graph Data stored successfully!");
    
            // Navigate after successful storage
            router.push(
                `/Ethereum-Subindex-Page?graphData=${encodeURIComponent(JSON.stringify(graphData))}&selectedProvider=${selectedProvider}&endpoint=${dynamicEndpoint}&indexName=${latestMessage}`
            );
        } catch (error) {
            console.error("Error storing Graph Data:", error);
        }
    };
    
    
    
    







    return (
        <>
            <div className="min-h-screen bg-[#121212] text-white p-12">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                    <button className="text-gray-400 hover:text-white" onClick={() => setStep(1)}>
                        ← Back to directory
                    </button>
                    <button className="text-gray-400 hover:text-white">Help</button>
                </div>

                {step === 1 ? (
                    // Step 1: Select Data Provider
                    <div>
                        <h1 className="text-3xl mt-24 font-bold">Create New Subindex</h1>
                        <p className="text-gray-400 mt-2 max-w-xl">
                            Use our AI assistant to generate a custom subindex based on your needs.
                            Select a data provider and refine your schema effortlessly.
                        </p>

                        <h2 className="text-xl font-bold mt-28">Select Chain</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-6">
                            {dataProviders.map((provider) => (
                                <div
                                    key={provider.id}
                                    className={`bg-[#1E1E1E] p-10 sm:p-16 flex justify-center items-center rounded-3xl cursor-pointer border-2 
                        ${selectedProvider === Number(provider.id) ? "border-blue-500" : "border-transparent"} hover:border-gray-500`}
                                    onClick={() => {
                                        setSelectedProvider(Number(provider.id));
                                        localStorage.setItem("selectedProvider", provider.id.toString());
                                    }}
                                >
                                    <Image
                                        src={provider.icon}
                                        alt={provider.name}
                                        width={96}
                                        height={40}
                                        className="w-20 h-8 sm:w-24 sm:h-10"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            className={`mt-10 px-6 py-3 bg-gray-600 text-white rounded-lg 
                ${selectedProvider !== null ? "hover:bg-gray-400" : "opacity-50 cursor-not-allowed"}`}
                            disabled={selectedProvider === null}
                            onClick={() => setStep(2)}
                        >
                            Next
                        </button>
                    </div>

                ) : (
                    <div className="mt-28 flex flex-col lg:flex-row gap-6 w-full mx-auto transition-all duration-500">
                        {/* Chat Section */}
                        <div className={`bg-[#1E1E1E] p-6 rounded-3xl flex-1 min-w-[300px] transition-all duration-500`}>
                            <div className="text-white text-lg font-bold mb-4">Hi! Let’s create your subindex.</div>
                            <p className="text-gray-400 mb-4">What type of data do you want to index?</p>

                            {/* Chat History */}
                            <div className="h-80 lg:h-96 overflow-y-auto space-y-4 custom-scrollbar px-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                        {msg.sender === "bot" && (
                                            <div className="flex flex-col items-start">
                                                <div className="flex items-center mb-1 space-x-2">
                                                    <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
                                                        🤖 {/* AI Icon */}
                                                    </div>
                                                </div>
                                                <div className="max-w-[100%] bg-[#3A3A3A] text-white p-3 rounded-lg break-words text-sm leading-relaxed">
                                                    {msg.text}
                                                </div>
                                            </div>
                                        )}
                                        {msg.sender === "user" && (
                                            <div className="flex flex-col items-end">
                                                <div className="max-w-[75%] bg-[#2D2D2D] text-white p-3 rounded-lg break-words text-sm leading-relaxed">
                                                    {msg.text}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>


                            {/* Chatbox */}
                            <div className="relative mt-4">
                                <textarea
                                    className="w-full bg-[#2E2E2E] text-white p-4 rounded-xl focus:outline-none resize-none"
                                    placeholder="Describe your subindex requirements"
                                    rows={3}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                {/* Arrow Send Button */}
                                {input.trim() && (
                                    <button
                                        onClick={handleSendMessage}
                                        className="absolute bottom-4 right-4 bg-gray-600 p-2 rounded-full hover:bg-gray-500 transition"
                                    >
                                        ➤
                                    </button>
                                )}
                            </div>

                            {/* Suggested Messages (Disappear after first message) */}
                            {messages.length === 0 && (
                                <div className="flex space-x-3 mt-4">
                                    {["Track DeFi transactions", "Index smart contract events", "Monitor NFT sales"].map((text, index) => (
                                        <button
                                            key={index}
                                            className="px-4 py-2 bg-[#333] text-gray-300 rounded-lg text-sm hover:bg-[#444]"
                                            onClick={() => {
                                                setInput(text);
                                                handleSendMessage();
                                            }}
                                        >
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Graph Section */}
                        {graphData.nodes.length > 0 && (
                            <div className={`bg-[#1E1E1E] p-6 rounded-3xl shadow-xl border border-gray-700 flex flex-col transition-all duration-500 
                            ${graphData.nodes.length > 0 ? "lg:w-[50%]" : "lg:w-[40%]"} min-w-[300px]`}>
                                <div className="text-white text-lg font-bold mb-4">Schema Preview</div>
                                <div className="flex space-x-4 text-gray-400 text-sm mb-4">
                                    <button onClick={() => setActivePreview("graph")} className={`${activePreview === "graph" ? "text-white" : "hover:text-white"} transition`}>
                                        Graph
                                    </button>
                                    <button onClick={() => setActivePreview("table")} className={`${activePreview === "table" ? "text-white" : "hover:text-white"} transition`}>
                                        Table
                                    </button>
                                    <button onClick={() => setActivePreview("text")} className={`${activePreview === "text" ? "text-white" : "hover:text-white"} transition`}>
                                        Text
                                    </button>
                                    <button onClick={() => setActivePreview("code")} className={`${activePreview === "code" ? "text-white" : "hover:text-white"} transition`}>
                                        Code
                                    </button>
                                </div>

                                <div className="flex-1 bg-black rounded-lg p-4 relative max-h-[400px] overflow-auto">
                                    {renderPreview()}
                                    <button className="absolute top-[-30px] right-1 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                                        JSON
                                    </button>
                                </div>
                                <button
                                    onClick={handleNavigation}
                                    className="mt-4 bg-blue-500 text-white py-2 rounded-lg font-bold">
                                    Deploy
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Scrollbar Styling */}
            <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #4a4a4a;
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
        `}</style>
        </>


    );
};

export default CreateSubindex;
