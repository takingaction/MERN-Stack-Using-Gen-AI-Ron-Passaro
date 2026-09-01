import { useState, useEffect, useRef } from "react";
import { getMessages, postMessage } from "../service/chatService";

function CourseChat({ courseId, userEmail }) {
    let [messages, setMessages] = useState([]);
    let [newMessage, setNewMessage] = useState("");
    let [loading, setLoading] = useState(true);
    let [error, setError] = useState("");
    let messagesEndRef = useRef(null);
    let pollIntervalRef = useRef(null);

    useEffect(() => {
        loadMessages();

        pollIntervalRef = setInterval(() => {
            loadMessages(false);
        }, 5000);

        return () => {
            if (pollIntervalRef) {
                clearInterval(pollIntervalRef);
            }
        };
    }, [courseId, userEmail]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    let scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    let loadMessages = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            let result = await getMessages(courseId, userEmail);
            if (result.success) {
                setMessages(result.data);
                setError("");
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error("Error loading messages:", err);
            setError("Failed to load messages");
        }
        if (showLoading) setLoading(false);
    };

    let handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            let result = await postMessage(courseId, userEmail, newMessage);
            if (result.success) {
                setNewMessage("");
                loadMessages(false);
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Failed to send message");
        }
    };

    let formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return <p>Loading chat...</p>;
    }

    return (
        <div className="course-chat" style={{ display: "flex", flexDirection: "column", height: "400px" }}>
            <h4>Group Chat</h4>
            {error && <p className="msg-error">{error}</p>}

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    background: "#f9f9f9"
                }}
            >
                {messages.length === 0 ? (
                    <p className="small-note" style={{ textAlign: "center" }}>No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            style={{
                                marginBottom: "0.75rem",
                                padding: "0.5rem",
                                background: msg.senderEmail === userEmail ? "#e3f2fd" : "#fff",
                                borderRadius: "8px",
                                borderLeft: msg.senderEmail === userEmail ? "4px solid #2196f3" : "4px solid #ddd"
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                                <strong style={{ fontSize: "0.9rem" }}>{msg.senderEmail}</strong>
                                <small style={{ color: "#666" }}>{formatTime(msg.timestamp)}</small>
                            </div>
                            <p style={{ margin: 0 }}>{msg.message}</p>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ display: "flex", gap: "0.5rem" }}>
                <input
                    className="input-field"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1 }}
                />
                <button className="button" type="submit">Send</button>
            </form>
        </div>
    );
}

export default CourseChat;
