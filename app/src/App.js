import React, { useState, useEffect } from 'react';
import './App.css';
import { api } from './firebase';
import Post from './post';
import ChatbotWrapper from './chatbot';

function App() {
  const [posts, setPosts] = useState([]);
  const [creativeWritings, setCreativeWritings] = useState([]);
  const [graffiti, setGraffiti] = useState([]);
  const [input, setInput] = useState('');
  const [creativeInput, setCreativeInput] = useState('');
  const [graffitiInput, setGraffitiInput] = useState('');
  const [commentInput, setCommentInput] = useState({});
  const [creativeCommentInput, setCreativeCommentInput] = useState({});
  const [graffitiCommentInput, setGraffitiCommentInput] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showCreativeComments, setShowCreativeComments] = useState({});
  const [showGraffitiComments, setShowGraffitiComments] = useState({});
  const [chatbotInput, setChatbotInput] = useState('');
  const [chatbotResponse, setChatbotResponse] = useState('');
  const [chatbot, setChatbot] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeSection, setActiveSection] = useState('herald'); // 'herald', 'insaneNews', or 'graffiti'
  const [miniDigest, setMiniDigest] = useState('');
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPosts = await api.getPosts();
        setPosts(fetchedPosts);
        const fetchedCreativeWritings = await api.getCreativeWritings();
        setCreativeWritings(fetchedCreativeWritings);
        const fetchedGraffiti = await api.getGraffiti();
        setGraffiti(fetchedGraffiti);
        const apiKey = "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"
        const newChatbot = new ChatbotWrapper(apiKey);
        newChatbot.ingestData([
          { section: 'blog', items: fetchedPosts },
          { section: 'insane new york news', items: fetchedCreativeWritings },
          { section: 'graffiti', items: fetchedGraffiti }
        ]);
        setChatbot(newChatbot);
        updateMiniDigest(newChatbot);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const updateMiniDigest = async (chatbotInstance) => {
    try {
      const digest = await chatbotInstance.chat("Provide a brief summary of the latest content from all sections in about 50 words.");
      setMiniDigest(digest);
    } catch (error) {
      console.error("Error updating mini digest:", error);
      setMiniDigest("Unable to generate mini digest at this time.");
    }
  };

  const handleSubmit = async (e, section) => {
    e.preventDefault();
    try {
      if (section === 'insaneNews') {
        await api.createCreativeWriting(creativeInput);
        const updatedCreativeWritings = await api.getCreativeWritings();
        setCreativeWritings(updatedCreativeWritings);
        setCreativeInput('');
      } else if (section === 'graffiti') {
        await api.createGraffiti(graffitiInput);
        const updatedGraffiti = await api.getGraffiti();
        setGraffiti(updatedGraffiti);
        setGraffitiInput('');
      } else {
        await api.createPost(input);
        const updatedPosts = await api.getPosts();
        setPosts(updatedPosts);
        setInput('');
      }
      const allPosts = [...await api.getPosts(), ...await api.getCreativeWritings(), ...await api.getGraffiti()];
      chatbot.ingestData([
        { section: 'blog', items: allPosts },
        { section: 'creative', items: allPosts },
        { section: 'graffiti', items: allPosts }
      ]);
      updateMiniDigest(chatbot);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleAddComment = async (postId, commentContent, section) => {
    if (commentContent) {
      try {
        if (section === 'insaneNews') {
          await api.addCreativeComment(postId, commentContent);
          const updatedCreativeWritings = await api.getCreativeWritings();
          setCreativeWritings(updatedCreativeWritings);
        } else if (section === 'graffiti') {
          await api.addGraffitiComment(postId, commentContent);
          const updatedGraffiti = await api.getGraffiti();
          setGraffiti(updatedGraffiti);
        } else {
          await api.addComment(postId, commentContent);
          const updatedPosts = await api.getPosts();
          setPosts(updatedPosts);
        }
        const allPosts = [...await api.getPosts(), ...await api.getCreativeWritings(), ...await api.getGraffiti()];
        chatbot.ingestData([
          { section: 'blog', items: allPosts },
          { section: 'creative', items: allPosts },
          { section: 'graffiti', items: allPosts }
        ]);
        updateMiniDigest(chatbot);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleCommentInputChange = (postId, value, section) => {
    if (section === 'insaneNews') {
      setCreativeCommentInput(prevState => ({
        ...prevState,
        [postId]: value
      }));
    } else if (section === 'graffiti') {
      setGraffitiCommentInput(prevState => ({
        ...prevState,
        [postId]: value
      }));
    } else {
      setCommentInput(prevState => ({
        ...prevState,
        [postId]: value
      }));
    }
  };

  const toggleComments = (postId, section) => {
    if (section === 'insaneNews') {
      setShowCreativeComments({ ...showCreativeComments, [postId]: !showCreativeComments[postId] });
    } else if (section === 'graffiti') {
      setShowGraffitiComments({ ...showGraffitiComments, [postId]: !showGraffitiComments[postId] });
    } else {
      setShowComments({ ...showComments, [postId]: !showComments[postId] });
    }
  };

  const handleChatbotSubmit = async (e) => {
    e.preventDefault();
    if (chatbot && chatbotInput.trim()) {
      try {
        const response = await chatbot.chat(chatbotInput);
        setChatbotResponse(response);
        setChatbotInput('');
      } catch (error) {
        console.error("Error getting chatbot response:", error);
        setChatbotResponse("Sorry, I encountered an error.");
      }
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const retro90sStyle = {
    fontFamily: '"Courier New", monospace',
    backgroundColor: '#D3D3D3',
    color: 'black',
    border: '2px solid #000000',
    borderRadius: '10px',
    padding: '10px',
  };

  return (
    <div className="App" style={{ ...retro90sStyle, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', textShadow: '2px 2px #FF69B4', margin: '10px 0' }}>The Herald</h1>
      <h2 style={{ textAlign: 'center', textShadow: '2px 2px #FF69B4', margin: '10px 0' }}>The People's Paper!</h2>
      <div className="section-buttons" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={() => setActiveSection('herald')} style={{ ...retro90sStyle, cursor: 'pointer', marginRight: '10px' }}>Blog</button>
        <button onClick={() => setActiveSection('insaneNews')} style={{ ...retro90sStyle, cursor: 'pointer', marginRight: '10px' }}>Insane New York News</button>
        <button onClick={() => setActiveSection('graffiti')} style={{ ...retro90sStyle, cursor: 'pointer', marginRight: '10px' }}>Graffiti</button>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <a href="https://forms.gle/kDMh3s8N7Q9fXhJj6" target="_blank">
              <button style={{ ...retro90sStyle, cursor: 'pointer' }}>Feedback</button>
            </a>
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: 'hidden' }}>
        {activeSection === 'herald' && (
          <div className="posts-section" style={{ width: '100%', overflowY: 'auto', padding: '20px' }}>
            {isLocalhost && (
              <form onSubmit={(e) => handleSubmit(e, 'herald')} style={{ marginTop: '20px', padding: '10px' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write your blog post here (Markdown supported)..."
                  style={{ ...retro90sStyle, marginRight: '5px', width: '100%', height: '500px' }}
                />
                <button type="submit" style={{ ...retro90sStyle, marginLeft: '5px', cursor: 'pointer' }}>Submit</button>
              </form>
            )}
            <div className="feed">
              {posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onToggleComments={(postId) => toggleComments(postId, 'herald')}
                  showComments={showComments[post.id]}
                  commentInput={commentInput[post.id] || ''}
                  onCommentInputChange={(value) => handleCommentInputChange(post.id, value, 'herald')}
                  onAddComment={(commentContent) => {
                    handleAddComment(post.id, commentContent, 'herald');
                    setCommentInput({ ...commentInput, [post.id]: '' });
                  }}
                  retro90sStyle={retro90sStyle}
                />
              ))}
            </div>
          </div>
        )}
        {activeSection === 'insaneNews' && (
          <div className="creative-writing-section" style={{ width: '100%', overflowY: 'auto', padding: '20px' }}>
            {isLocalhost && (
              <form onSubmit={(e) => handleSubmit(e, 'insaneNews')} style={{ marginTop: '20px', padding: '10px' }}>
                <textarea
                  value={creativeInput}
                  onChange={(e) => setCreativeInput(e.target.value)}
                  placeholder="Write your insane New York story here (Markdown supported)..."
                  style={{ ...retro90sStyle, marginRight: '5px', width: '100%', minHeight: '100px' }}
                />
                <button type="submit" style={{ ...retro90sStyle, marginLeft: '5px', cursor: 'pointer' }}>Submit</button>
              </form>
            )}
            <div className="feed">
              {creativeWritings.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onToggleComments={(postId) => toggleComments(postId, 'insaneNews')}
                  showComments={showCreativeComments[post.id]}
                  commentInput={creativeCommentInput[post.id] || ''}
                  onCommentInputChange={(value) => handleCommentInputChange(post.id, value, 'insaneNews')}
                  onAddComment={(commentContent) => {
                    handleAddComment(post.id, commentContent, 'insaneNews');
                    setCreativeCommentInput({ ...creativeCommentInput, [post.id]: '' });
                  }}
                  retro90sStyle={retro90sStyle}
                />
              ))}
            </div>
          </div>
        )}
        {activeSection === 'graffiti' && (
          <div className="graffiti-section" style={{ width: '100%', overflowY: 'auto', padding: '20px' }}>
            <form onSubmit={(e) => handleSubmit(e, 'graffiti')} style={{ marginTop: '20px', padding: '10px' }}>
              <textarea
                value={graffitiInput}
                onChange={(e) => setGraffitiInput(e.target.value)}
                placeholder="Write your graffiti here (Markdown supported)..."
                style={{ ...retro90sStyle, marginRight: '5px', width: '100%', minHeight: '100px' }}
              />
              <button type="submit" style={{ ...retro90sStyle, marginLeft: '5px', cursor: 'pointer' }}>Submit</button>
            </form>
            <div className="feed">
              {graffiti.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onToggleComments={(postId) => toggleComments(postId, 'graffiti')}
                  showComments={showGraffitiComments[post.id]}
                  commentInput={graffitiCommentInput[post.id] || ''}
                  onCommentInputChange={(value) => handleCommentInputChange(post.id, value, 'graffiti')}
                  onAddComment={(commentContent) => {
                    handleAddComment(post.id, commentContent, 'graffiti');
                    setGraffitiCommentInput({ ...graffitiCommentInput, [post.id]: '' });
                  }}
                  retro90sStyle={retro90sStyle}
                />
              ))}
            </div>
          </div>
        )}
        {isMobile && (
          <button 
            onClick={toggleChatbot} 
            style={{
              ...retro90sStyle,
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: '1001',
              cursor: 'pointer'
            }}
          >
            {showChatbot ? 'Close Chatbot' : 'Open Chatbot'}
          </button>
        )}
        {(!isMobile || (isMobile && showChatbot)) && (
          <div className="chatbot-section" style={{
            ...retro90sStyle,
            width: isMobile ? '100%' : '25%',
            height: isMobile ? '50%' : 'auto',
            borderLeft: isMobile ? 'none' : '3px solid #FF1493',
            padding: '20px',
            position: isMobile ? 'fixed' : 'relative',
            bottom: isMobile ? '0' : 'auto',
            left: isMobile ? '0' : 'auto',
            right: isMobile ? '0' : 'auto',
            zIndex: isMobile ? '1000' : 'auto',
            overflowY: 'auto',
            transition: 'all 0.3s ease-in-out',
            transform: isMobile ? (showChatbot ? 'translateY(0)' : 'translateY(100%)') : 'none'
          }}>
            <h2 style={{ textAlign: 'center', textShadow: '2px 2px #FF69B4' }}>Chatbot</h2>
            <div className="mini-digest" style={{ ...retro90sStyle, marginBottom: '15px', padding: '10px', border: '2px dashed #FF69B4' }}>
              <h3 style={{ marginBottom: '5px' }}>Mini Digest</h3>
              <p>{miniDigest}</p>
            </div>
            <div className="chatbot">
              <form onSubmit={handleChatbotSubmit}>
                <input
                  type="text"
                  value={chatbotInput}
                  onChange={(e) => setChatbotInput(e.target.value)}
                  placeholder="Ask about whatever is on the Herald..."
                  style={{ ...retro90sStyle, width: '100%', marginBottom: '10px' }}
                />
                <button type="submit" style={{ ...retro90sStyle, width: '100%', cursor: 'pointer' }}>Send</button>
              </form>
              {chatbotResponse && (
                <div style={{ ...retro90sStyle, marginTop: '10px' }}>
                  <strong>Chatbot:</strong> {chatbotResponse}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
