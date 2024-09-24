import React, { useState, useEffect } from 'react';
import './App.css';
import { api } from './firebase';
import Post from './post';
import ChatbotWrapper from './chatbot';

function App() {
  const [posts, setPosts] = useState([]);
  const [creativeWritings, setCreativeWritings] = useState([]);
  const [input, setInput] = useState('');
  const [creativeInput, setCreativeInput] = useState('');
  const [commentInput, setCommentInput] = useState({});
  const [creativeCommentInput, setCreativeCommentInput] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showCreativeComments, setShowCreativeComments] = useState({});
  const [chatbotInput, setChatbotInput] = useState('');
  const [chatbotResponse, setChatbotResponse] = useState('');
  const [chatbot, setChatbot] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeSection, setActiveSection] = useState('herald'); // 'herald' or 'insaneNews'

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPosts = await api.getPosts();
        setPosts(fetchedPosts);
        const fetchedCreativeWritings = await api.getCreativeWritings();
        setCreativeWritings(fetchedCreativeWritings);
        const apiKey = "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"
        const newChatbot = new ChatbotWrapper(apiKey);
        newChatbot.ingestData([
          { section: 'blog', items: fetchedPosts },
          { section: 'insane new york news', items: fetchedCreativeWritings }
        ]);
        setChatbot(newChatbot);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e, isCreativeWriting = false) => {
    e.preventDefault();
    try {
      if (isCreativeWriting) {
        await api.createCreativeWriting(creativeInput);
        const updatedCreativeWritings = await api.getCreativeWritings();
        setCreativeWritings(updatedCreativeWritings);
        setCreativeInput('');
      } else {
        await api.createPost(input);
        const updatedPosts = await api.getPosts();
        setPosts(updatedPosts);
        setInput('');
      }
      const allPosts = [...await api.getPosts(), ...await api.getCreativeWritings()];
      chatbot.ingestData([
        { section: 'blog', items: allPosts },
        { section: 'creative', items: allPosts }
      ]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleAddComment = async (postId, commentContent, isCreativeWriting = false) => {
    if (commentContent) {
      try {
        if (isCreativeWriting) {
          await api.addCreativeComment(postId, commentContent);
          const updatedCreativeWritings = await api.getCreativeWritings();
          setCreativeWritings(updatedCreativeWritings);
        } else {
          await api.addComment(postId, commentContent);
          const updatedPosts = await api.getPosts();
          setPosts(updatedPosts);
        }
        const allPosts = [...await api.getPosts(), ...await api.getCreativeWritings()];
        chatbot.ingestData([
          { section: 'blog', items: allPosts },
          { section: 'creative', items: allPosts }
        ]);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleCommentInputChange = (postId, value, isCreativeWriting = false) => {
    if (isCreativeWriting) {
      setCreativeCommentInput(prevState => ({
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

  const toggleComments = (postId, isCreativeWriting = false) => {
    if (isCreativeWriting) {
      setShowCreativeComments({ ...showCreativeComments, [postId]: !showCreativeComments[postId] });
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
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <a href="https://www.google.com" target="_blank">
              <button style={{ ...retro90sStyle, cursor: 'pointer' }}>Feedback</button>
            </a>
          </div>
      </div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: 'hidden' }}>
        {activeSection === 'herald' && (
          <div className="posts-section" style={{ width: '100%', overflowY: 'auto', padding: '20px' }}>
            <form onSubmit={(e) => handleSubmit(e)} style={{ marginTop: '20px', padding: '10px' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write your blog post here (Markdown supported)..."
                style={{ ...retro90sStyle, marginRight: '5px', width: '100%', minHeight: '100px' }}
              />
              <button type="submit" style={{ ...retro90sStyle, marginLeft: '5px', cursor: 'pointer' }}>Submit</button>
            </form>
            <div className="feed">
              {posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onToggleComments={(postId) => toggleComments(postId)}
                  showComments={showComments[post.id]}
                  commentInput={commentInput[post.id] || ''}
                  onCommentInputChange={(value) => handleCommentInputChange(post.id, value)}
                  onAddComment={(commentContent) => {
                    handleAddComment(post.id, commentContent);
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
            <form onSubmit={(e) => handleSubmit(e, true)} style={{ marginTop: '20px', padding: '10px' }}>
              <textarea
                value={creativeInput}
                onChange={(e) => setCreativeInput(e.target.value)}
                placeholder="Write your insane New York story here (Markdown supported)..."
                style={{ ...retro90sStyle, marginRight: '5px', width: '100%', minHeight: '100px' }}
              />
              <button type="submit" style={{ ...retro90sStyle, marginLeft: '5px', cursor: 'pointer' }}>Submit</button>
            </form>
            <div className="feed">
              {creativeWritings.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  onToggleComments={(postId) => toggleComments(postId, true)}
                  showComments={showCreativeComments[post.id]}
                  commentInput={creativeCommentInput[post.id] || ''}
                  onCommentInputChange={(value) => handleCommentInputChange(post.id, value, true)}
                  onAddComment={(commentContent) => {
                    handleAddComment(post.id, commentContent, true);
                    setCreativeCommentInput({ ...creativeCommentInput, [post.id]: '' });
                  }}
                  retro90sStyle={retro90sStyle}
                />
              ))}
            </div>
          </div>
        )}
        {(!isMobile || (isMobile && showChatbot)) && (
          <div className="chatbot-section" style={{
            ...retro90sStyle,
            width: isMobile ? '100%' : '25%',
            borderLeft: isMobile ? 'none' : '3px solid #FF1493',
            padding: '20px',
            position: isMobile ? 'fixed' : 'relative',
            bottom: isMobile ? '0' : 'auto',
            left: isMobile ? '0' : 'auto',
            right: isMobile ? '0' : 'auto',
            zIndex: isMobile ? '1000' : 'auto'
          }}>
            <h2 style={{ textAlign: 'center', textShadow: '2px 2px #FF69B4' }}>Chatbot</h2>
            <div className="chatbot">
              <form onSubmit={handleChatbotSubmit}>
                <input
                  type="text"
                  value={chatbotInput}
                  onChange={(e) => setChatbotInput(e.target.value)}
                  placeholder="Ask the chatbot something..."
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
