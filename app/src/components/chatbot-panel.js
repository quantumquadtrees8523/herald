import React, { useState } from 'react';

const ChatbotPanel = ({ isMobile, chatbotMinimized, retro90sStyle, globalChatbot }) => {
    const [chatbotInput, setChatbotInput] = useState('');
    const [chatbotResponse, setChatbotResponse] = useState('');
    const [isMinimized, setIsMinimized] = useState(chatbotMinimized);
    const [chatbot, setChatbot] = useState(globalChatbot);

    const toggleChatbotMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleChatbotSubmit = async (e) => {
        e.preventDefault();
        const aiResponse = await chatbot.chat(chatbotInput);
        setChatbotResponse(aiResponse);
        setChatbotInput('');
    };

    const strongBlackBorder = '3px solid #000000';
    const mediumBlackBorder = '2px solid #000000';
  
    const chatbotSectionStyle = {
        ...retro90sStyle,
        width: '97%',
        height: '100%',
        borderLeft: strongBlackBorder,
        borderRight: '6px solid #000000',
        padding: '10px',
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        marginRight: '100px'
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
        border: mediumBlackBorder,
        marginLeft: '5px'
    };

    const chatbotContainerStyle = {
        ...retro90sStyle,
        border: strongBlackBorder,
        padding: '10px',
        marginTop: '5px'
    };

    const inputStyle = {
        ...retro90sStyle,
        width: 'calc(100% - 70px)',
        marginBottom: '10px',
        border: mediumBlackBorder,
        padding: '5px'
    };

    const sendButtonStyle = {
        ...retro90sStyle,
        width: '60px',
        cursor: 'pointer',
        border: mediumBlackBorder,
        marginLeft: '10px'
    };

    const responseStyle = {
        ...retro90sStyle,
        marginTop: '10px',
        border: mediumBlackBorder,
        padding: '10px',
        height: '100px',
        overflowY: 'auto'
    };

    return (
        <div className="chatbot-section" style={chatbotSectionStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>Chatbot</h2>
                <div>
                    <button 
                        onClick={toggleChatbotMinimize} 
                        style={buttonStyle}
                    >
                        {isMinimized ? 'Maximize' : 'Minimize'}
                    </button>
                </div>
            </div>
            {!isMinimized && (
                <div className="chatbot-container" style={chatbotContainerStyle}>
                    <h3>Ask the Chatbot</h3>
                    <form onSubmit={handleChatbotSubmit} style={{ display: 'flex' }}>
                        <input
                            type="text"
                            value={chatbotInput}
                            onChange={(e) => setChatbotInput(e.target.value)}
                            placeholder="Ask about whatever is on the Herald..."
                            style={inputStyle}
                        />
                        <button type="submit" style={sendButtonStyle}>Send</button>
                    </form>
                    <div style={responseStyle}>
                        {chatbotResponse && (
                            <>
                                <strong>Chatbot:</strong> {chatbotResponse}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotPanel;
