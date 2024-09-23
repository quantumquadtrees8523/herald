import React, { useState, useEffect } from 'react';
import './App.css';
import { api } from './firebase';

function App() {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState('');
  const [tab, setTab] = useState('form');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await api.getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createPost(input);
      const updatedPosts = await api.getPosts();
      setPosts(updatedPosts);
      setInput('');
      setTab('feed');
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleAddComment = async (postId, commentContent) => {
    if (commentContent) {
      try {
        await api.addComment(postId, commentContent);
        const updatedPosts = await api.getPosts();
        setPosts(updatedPosts);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const [commentInput, setCommentInput] = useState({});
  const [showComments, setShowComments] = useState({});

  const handleCommentInputChange = (postId, value) => {
    setCommentInput({ ...commentInput, [postId]: value });
  };

  const toggleComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  // Import the markdown parser
  const ReactMarkdown = require('react-markdown');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Herald</h1>
        <nav>
          <button style={{ marginRight: '10px' }} onClick={() => setTab('form')}>Form</button>
          <button onClick={() => setTab('feed')}>Feed</button>
        </nav>
        {tab === 'form' && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '10px' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write your blog post here (Markdown supported)..."
              style={{ marginRight: '5px' }}
            />
            <button type="submit" style={{ marginLeft: '5px' }}>Submit</button>
          </form>
        )}
        {tab === 'feed' && (
          <div className="feed">
            {posts.map((post) => (
              <div key={post.id} className="post">
                <ReactMarkdown>{post.content}</ReactMarkdown>
                <button onClick={() => toggleComments(post.id)} style={{ marginTop: '10px' }}>
                  {showComments[post.id] ? 'Hide Comments' : 'Show Comments'}
                </button>
                {showComments[post.id] && (
                  <div className="comments" style={{ marginTop: '10px' }}>
                    {post.comments && post.comments.map((comment, commentIndex) => (
                      <div key={commentIndex} className="comment" style={{ fontSize: '0.9em', marginTop: '5px' }}>
                        <ReactMarkdown>{comment.content}</ReactMarkdown>
                      </div>
                    ))}
                    <textarea
                      value={commentInput[post.id] || ''}
                      placeholder="Write a comment (Markdown supported)..."
                      style={{ marginTop: '10px', marginRight: '5px', fontSize: '0.9em' }}
                      onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                    />
                    <button
                      style={{ marginLeft: '5px', fontSize: '0.9em' }}
                      onClick={() => {
                        handleAddComment(post.id, commentInput[post.id]);
                        setCommentInput({ ...commentInput, [post.id]: '' });
                      }}
                    >
                      Add Comment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
