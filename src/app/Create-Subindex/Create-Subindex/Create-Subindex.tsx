"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from 'next/image';

const dataProviders = [
    { id: 1, icon: "/QuickNode.png", name: "QuickNode" },
    { id: 2, icon: "/Ankr.png", name: "Ankr" },
    { id: 3, icon: "/Infura.png", name: "Infura" },
    { id: 4, icon: "/Morails.png", name: "Moralis" },
    { id: 5, icon: "/Alcheme.png", name: "Alchemy" },
];

const CreateSubindex = () => {
    const router = useRouter();
    const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
    const [step, setStep] = useState(1); // Step 1: Select Provider, Step 2: Chatbot UI
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);

    // Mock API Response (Replace this with OpenAI API call later)
    const fetchAIResponse = async (userMessage: string) => {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer`, // Replace with your actual API key
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: "You are an AI assistant for indexing data." },
                        { role: "user", content: userMessage }
                    ],
                }),
            });

            const data = await response.json();

            // Handle API errors
            if (!response.ok) {
                console.error("OpenAI API Error:", data);
                return "AI is currently unavailable. Please try again later.";
            }

            // Ensure choices array exists before accessing index 0
            if (data.choices && data.choices.length > 0) {
                return data.choices[0].message.content || "I couldn't process that.";
            } else {
                return "AI response was empty. Try again.";
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return "There was an error fetching the response. Please try again.";
        }
    };

    const handleNavigation = () => {
        // Add any logout logic here (e.g., clearing auth tokens)
        router.push("/Ethereum-Subindex-Page"); // Redirect to login page
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        // Add user message to chat
        const newMessages = [...messages, { sender: "user" as const, text: input }];
        setMessages(newMessages);
        setInput("");

        // Placeholder response while waiting for AI
        setMessages([...newMessages, { sender: "bot" as const, text: "Thinking..." }]);

        // Fetch AI response
        const response = await fetchAIResponse(input);

        // Update messages with AI response
        setMessages([...newMessages, { sender: "bot" as const, text: response }]);
    };


    return (
        <div className="min-h-screen bg-[#121212] text-white p-12">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
                <button className="text-gray-400 hover:text-white" onClick={() => setStep(1)}>← Back to directory</button>
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

                    <h2 className="text-xl font-bold mt-28">Select Data Provider</h2>
                    <div className="grid grid-cols-5 gap-6 mt-6">
                        {dataProviders.map((provider) => (
                            <div
                                key={provider.id}
                                className={`bg-[#1E1E1E] p-16 flex justify-center items-center rounded-3xl cursor-pointer border-2 
                ${selectedProvider === provider.id ? "border-blue-500" : "border-transparent"} hover:border-gray-500`}
                                onClick={() => setSelectedProvider(provider.id)}
                            >
                                <Image
                                    src={provider.icon}
                                    alt={provider.name}
                                    width={96} // 24 * 4
                                    height={40} // 10 * 4
                                    className="w-24 h-10"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        className={`mt-10 px-6 py-3 bg-gray-600 text-white rounded-lg 
            ${selectedProvider ? "hover:bg-gray-400" : "opacity-50 cursor-not-allowed"}`}
                        disabled={!selectedProvider}
                        onClick={() => setStep(2)}
                    >
                        Next
                    </button>
                </div>
            ) : (
                // Step 2: Chatbot UI
                <>
                    <div className="mt-28 w-[1500px] mx-auto flex transition-all duration-500">
                        <div className={`flex-1 transition-all duration-500 ${messages.length > 0 ? "mr-6" : "mx-auto"}`}>
                            <h1 className="text-xl font-bold mt-12"><Image
                                src="/logo.png"
                                alt="Company 1"
                                width={40} // Tailwind w-10 equals 40px
                                height={40}
                                className="w-10"
                            /></h1><br />
                            <p className="text-gray-400 mt-2">Hi! Lets create your subindex. What type of data do you want to index?</p><br />

                            {/* Chat Messages and Input Combined */}
                            <div className="mt-6 bg-[#1E1E1E] p-4 rounded-lg h-96 overflow-y-auto space-y-3 flex flex-col">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`p-2 rounded-md max-w-xs ${msg.sender === "user" ? "bg-[#1E1E1E] ml-auto" : "bg-[#1E1E1E]"}`}>
                                        {msg.text}
                                    </div>
                                ))}

                                {/* User Input Field at the Bottom Inside the Box */}
                                <div className="flex items-center bg-[#1E1E1E] p-3 rounded-lg mt-auto align-bottom">
                                    <textarea
                                        placeholder="Describe your subindex requirements"
                                        className="w-full bg-transparent text-white outline-none resize-none p-2"
                                        rows={2}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    {/*<button
                                        className="bg-gray-700 p-2 h-10 rounded-lg hover:bg-gray-500 ml-4"
                                        onClick={handleSendMessage}
                                    >
                                        <FaArrowUp className="text-white" />
                                    </button>*/}
                                </div>
                            </div>

                            {/* Suggested Options */}
                            <div className="mt-4 flex space-x-4">
                                {["Track DeFi transactions", "Index smart contract events", "Monitor NFT sales"].map((option, index) => (
                                    <button
                                        key={index}
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600"
                                        onClick={() => {
                                            setInput(option);
                                            handleSendMessage();
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>


                        {messages.length > 0 && (
                            <div className="w-[700px] bg-[#111] p-6 rounded-lg shadow-xl border border-gray-700 flex flex-col transition-all duration-500">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4 px-4">
                                    <h2 className="text-lg font-bold text-white">Schema Preview</h2>
                                    <button className="bg-gray-800 px-3 py-1 rounded-md text-white text-sm flex items-center gap-2">
                                        JSON <span className="material-icons">sync</span>
                                    </button>
                                </div>

                                <p className="text-gray-400 px-4">This is a live preview of your subindex schema. Modify fields or refine details before deployment.</p>

                                {/* Schema Preview Section */}
                                <div className="flex flex-1 p-2">
                                    {/* Sidebar */}
                                    <div className="flex flex-col items-center space-y-4 border-r border-gray-700 pr-2">
                                        <button className="text-gray-400 hover:text-white text-sm">🔄 Undo</button>
                                        <button className="text-gray-400 hover:text-white text-sm">📄 Preview</button>
                                    </div>

                                    {/* Schema Graph */}
                                    <div className="flex-1 flex items-center justify-center bg-black p-2 rounded-lg border border-gray-700 relative">
                                        {/* Graph Image Placeholder */}
                                        <div className="flex flex-col items-center space-y-3 border-r border-gray-700 mt-[-290px] pr-2 ml-[-160px]">
                                            <button className="text-gray-400 hover:text-white text-sm">📊 Graph</button>
                                            <button className="text-gray-400 hover:text-white text-sm">📋 Table</button>
                                            <button className="text-gray-400 hover:text-white text-sm">📝 Text</button>
                                            <button className="text-gray-400 hover:text-white text-sm">💻 Code</button>
                                        </div>
                                        <Image
                                            src="/graph.png"
                                            alt="Schema Preview"
                                            width={300}
                                            height={300}
                                            className="h-full text-center object-contain"
                                        />

                                        {/* Zoom Controls */}
                                        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                                            <button className="bg-gray-700 p-2 rounded-md text-white">➕</button>
                                            <button className="bg-gray-700 p-2 rounded-md text-white">➖</button>
                                            <button className="bg-gray-700 p-2 rounded-md text-white">⚙️</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Deploy Button */}
                                <div className="px-4 pb-4 flex justify-end">
                                    <button
                                        onClick={handleNavigation}
                                        className="w-52 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 text-white">Deploy</button>
                                </div>
                            </div>
                        )}


                    </div>
                </>
            )}
        </div>
    );
};

export default CreateSubindex;
