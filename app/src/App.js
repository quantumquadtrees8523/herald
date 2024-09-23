import React, { useState, useEffect } from 'react';
import './App.css';
import { api } from './firebase';
import Post from './post';

function App() {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState('');
  const [tab, setTab] = useState('form');
  const [commentInput, setCommentInput] = useState({});
  const [showComments, setShowComments] = useState({});

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
      console.log(input);
      await api.createPost(input);
      const updatedPosts = await api.getPosts();
      setPosts(updatedPosts);
      setInput('');
      // setTab('feed');
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

  const handleCommentInputChange = (postId, value) => {
    setCommentInput({ ...commentInput, [postId]: value });
  };

  const toggleComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

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
              <Post
                key={post.id}
                post={post}
                onToggleComments={toggleComments}
                showComments={showComments[post.id]}
                commentInput={commentInput[post.id] || ''}
                onCommentInputChange={(value) => handleCommentInputChange(post.id, value)}
                onAddComment={(commentContent) => {
                  handleAddComment(post.id, commentContent);
                  setCommentInput({ ...commentInput, [post.id]: '' });
                }}
              />
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
