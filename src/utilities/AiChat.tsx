import { useState, useEffect, useRef } from 'react';
import '../css/AiChat.css'
import Logo from '../../public/robot.svg?react';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface ChatResponse {
    choices: Array<{
        message: {
            content: string;
            role: string;
        };
    }>;
}

export default function AiChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // För att visa/dölja chatten
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || isLoading) return;

        const userMessage: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] })
            });

            const data: ChatResponse = await response.json();
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.choices[0].message.content
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Oj, något gick fel. Försök igen senare!' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-chat-container">
            {/* Själva chattfönstret */}
            {isOpen && (
                <div className="ai-chat-window">
                    <div className="ai-chat-header">
                        <span>Filmvisaren AI-Support</span>
                        <button onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="ai-chat-messages">
                        {messages.length === 0 && (
                            <p className="welcome-text">Hej! Undrar du något om våra filmer eller hur man bokar?</p>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`message-bubble ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && <div className="message-bubble assistant loading">Tänker...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="ai-chat-input">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Skriv ett meddelande..."
                        />
                        <button onClick={sendMessage} disabled={isLoading}>Skicka</button>
                    </div>
                </div>
            )}

            {/* Bubblan man klickar på */}
            <button className="ai-chat-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? ('Stäng') : (<Logo className='ai-chat-logo-icon' />)}
            </button>
        </div>
    );
}