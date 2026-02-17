import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Send, X, MessageCircle, Paperclip } from "lucide-react";
import api from "../services/api";

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://telemedicine-web.onrender.com";

function ChatBox({ currentUser, receiver, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Initialize Socket
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // Join room
        newSocket.emit("join_room", currentUser.id);

        // Fetch Chat History
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/chat/history/${currentUser.id}/${receiver._id}`);
                setMessages(res.data);
                // Mark as read on open
                await api.put("/chat/read", { senderId: receiver._id, receiverId: currentUser.id });
            } catch (err) {
                console.error("Error fetching chat history", err);
            }
        };
        fetchHistory();

        // Listen for messages
        newSocket.on("receive_message", async (data) => {
            if (
                (data.sender === currentUser.id && data.receiver === receiver._id) ||
                (data.sender === receiver._id && data.receiver === currentUser.id)
            ) {
                setMessages((prev) => [...prev, data]);
                // If message is from the other person, mark it as read immediately
                if (data.sender === receiver._id) {
                    try {
                        await api.put("/chat/read", { senderId: receiver._id, receiverId: currentUser.id });
                    } catch (err) {
                        console.error("Error marking message as read", err);
                    }
                }
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [currentUser.id, receiver._id]);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !isUploading) || !socket) return;

        const messageData = {
            sender: currentUser.id,
            receiver: receiver._id,
            message: newMessage,
            createdAt: new Date(),
        };

        await socket.emit("send_message", messageData);
        setNewMessage("");
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await api.post("/chat/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const { fileUrl, fileType } = res.data;

            // Send message with file
            const messageData = {
                sender: currentUser.id,
                receiver: receiver._id,
                message: fileType === "image" ? "📷 Image" : "📎 File",
                fileUrl,
                fileType,
                createdAt: new Date(),
            };

            await socket.emit("send_message", messageData);

        } catch (err) {
            console.error("File upload failed", err);
            alert("File upload failed");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-t-xl rounded-b-xl shadow-2xl border border-gray-200 z-50 flex flex-col h-[500px]">

            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                        {receiver.profilePicture ? (
                            <img src={`${SOCKET_URL}${receiver.profilePicture}`} className="w-full h-full object-cover" alt="avatar" />
                        ) : (
                            <span className="text-lg">👤</span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold">{receiver.name}</h3>
                        <span className="text-xs text-blue-100 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span> Online
                        </span>
                    </div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded-full transition">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                {messages.map((msg, index) => {
                    const isMe = msg.sender === currentUser.id;
                    return (
                        <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm ${isMe
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                                    }`}
                            >
                                {msg.fileUrl ? (
                                    <div className="mb-1">
                                        {msg.fileType === "image" ? (
                                            <img
                                                src={`${SOCKET_URL}${msg.fileUrl}`}
                                                alt="attachment"
                                                className="rounded-lg max-h-48 object-cover cursor-pointer hover:opacity-90"
                                                onClick={() => window.open(`${SOCKET_URL}${msg.fileUrl}`, "_blank")}
                                            />
                                        ) : (
                                            <a
                                                href={`${SOCKET_URL}${msg.fileUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-2 underline ${isMe ? "text-white" : "text-blue-600"}`}
                                            >
                                                <Paperclip size={16} />
                                                Download Attachment
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <p>{msg.message}</p>
                                )}

                                <span className={`text-[10px] mt-1 block ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 rounded-b-xl flex gap-2 items-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-gray-400 hover:text-blue-600 p-2 transition disabled:opacity-50"
                >
                    <Paperclip size={20} />
                </button>

                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={isUploading ? "Uploading..." : "Type a message..."}
                    className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isUploading}
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || isUploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}

export default ChatBox;
