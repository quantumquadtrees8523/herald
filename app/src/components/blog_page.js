import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Post from './post';
import {api} from '../services/firebase';

function BlogPage({ 
  sectionName: initialSectionName, 
  retro90sStyle
}) {
  const [input, setInput] = useState('');
  const [posts, setPosts] = useState([]);
  const [sectionName] = useState(initialSectionName);
  const [isLocalhost, setIsLocalhost] = useState(true);
  const [previewMarkdown, setPreviewMarkdown] = useState('');

  useEffect(() => {
    const loadPage = async () => {
      const posts_list = await api.getPosts(sectionName);
      setPosts(posts_list);
      setIsLocalhost(window.location.hostname === 'localhost');
    }
    loadPage();
  }, [sectionName, isLocalhost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        const newPostId = await api.createPost(input, sectionName);
        const newPost = {
          id: newPostId,
          content: input,
          timestamp: new Date(),
          comments: []
        };
        setPosts([newPost, ...posts]);
        setInput('');
        setPreviewMarkdown('');
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setInput(newInput);
    setPreviewMarkdown(newInput);
  };
  
  return (
    <div className={`${sectionName}-section`} style={{ width: '100%', overflowY: 'auto', padding: '20px' }}>
    <h1>{sectionName}</h1>
      {(isLocalhost || sectionName === 'gra') && (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '10px' }}>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder={"Write a post (Markdown supported)..."}
            style={{ ...retro90sStyle, marginRight: '5px', width: '75%', height: '100px' }}
          />
          <div style={{ marginTop: '10px', marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>Preview:</h3>
            <ReactMarkdown>{previewMarkdown}</ReactMarkdown>
          </div>
          <button type="submit" style={{ ...retro90sStyle, marginLeft: '5px', cursor: 'pointer' }}>Submit</button>
        </form>
      )}
      <div className="feed">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            sectionName={sectionName}
            retro90sStyle={retro90sStyle}
          />
        ))}
      </div>
    </div>
  );
}

export default BlogPage;
