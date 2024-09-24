import React, { useEffect, useState } from 'react';
import ChatbotWrapper from '../services/chatbot';
import ReactMarkdown from 'react-markdown';

const ChatbotPanel = ({ isMobile, chatbotMinimized, retro90sStyle, chatbot }) => {
    const [miniDigest, setMiniDigest] = useState('');
    const [chatbotInput, setChatbotInput] = useState('');
    const [chatbotResponse, setChatbotResponse] = useState('');
    const [isMinimized, setIsMinimized] = useState(chatbotMinimized);

    useEffect(() => {
        const fetchMiniDigest = async () => {
            const digest = await chatbot.getMiniDigest();
            setMiniDigest(digest);
        };
        fetchMiniDigest();
    }, []);

    // Stub for toggleChatbotMinimize
    const toggleChatbotMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    // Stub for handleChatbotSubmit
    const handleChatbotSubmit =async (e) => {
        e.preventDefault();
        const aiResponse = await chatbot.chat(chatbotInput);
        setChatbotResponse(aiResponse);
        setChatbotInput('');
    };

    const strongBlackBorder = '3px solid #000000';
    const mediumBlackBorder = '2px solid #000000';
  
    const chatbotSectionStyle = {
        ...retro90sStyle,
        width: isMobile ? '100%' : '25%',
        height: isMinimized ? 'auto' : (isMobile ? '50%' : 'auto'),
        borderLeft: isMobile ? 'none' : strongBlackBorder,
        borderTop: strongBlackBorder,
        borderRight: strongBlackBorder,
        borderBottom: isMinimized ? 'none' : strongBlackBorder,
        padding: isMinimized ? '10px' : '20px',
        position: 'fixed',
        bottom: '0',
        right: '0',
        zIndex: '1000',
        overflowY: 'auto',
        transition: 'all 0.3s ease-in-out',
        transform: isMinimized ? 'translateY(calc(100% - 40px))' : 'translateY(0)'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    };

    const titleStyle = {
        textAlign: 'center',
        textShadow: '2px 2px #FF69B4',
        margin: '0'
    };

    const buttonStyle = {
        ...retro90sStyle,
        cursor: 'pointer',
        padding: '5px 10px',
        border: mediumBlackBorder
    };

    const miniDigestStyle = {
        ...retro90sStyle,
        marginBottom: '15px',
        padding: '10px',
        border: mediumBlackBorder
    };

    const inputStyle = {
        ...retro90sStyle,
        width: '100%',
        marginBottom: '10px',
        border: mediumBlackBorder
    };

    const sendButtonStyle = {
        ...retro90sStyle,
        width: '100%',
        cursor: 'pointer',
        border: mediumBlackBorder
    };

    const responseStyle = {
        ...retro90sStyle,
        marginTop: '10px',
        border: mediumBlackBorder,
        padding: '10px'
    };

    return (
        <div className="chatbot-section" style={chatbotSectionStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>Chatbot</h2>
                <button 
                    onClick={toggleChatbotMinimize} 
                    style={buttonStyle}
                >
                    {isMinimized ? 'Maximize' : 'Minimize'}
                </button>
            </div>
            {!isMinimized && (
                <>
                    <div className="mini-digest" style={miniDigestStyle}>
                        <h3 style={{ marginBottom: '5px' }}>Mini Digest</h3>
                        <ReactMarkdown>{miniDigest}</ReactMarkdown>
                    </div>
                    <div className="chatbot">
                        <form onSubmit={handleChatbotSubmit}>
                            <input
                                type="text"
                                value={chatbotInput}
                                onChange={(e) => setChatbotInput(e.target.value)}
                                placeholder="Ask about whatever is on the Herald..."
                                style={inputStyle}
                            />
                            <button type="submit" style={sendButtonStyle}>Send</button>
                        </form>
                        {chatbotResponse && (
                            <div style={responseStyle}>
                                <strong>Chatbot:</strong> {chatbotResponse}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatbotPanel;
