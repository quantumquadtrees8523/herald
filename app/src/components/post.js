import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Comment from './comment';
import { api } from '../services/firebase';

const Post = ({ post, sectionName }) => {
  const [localComments, setLocalComments] = useState([]);
  const [localCommentInput, setLocalCommentInput] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await api.getComments(sectionName, post.id);
        console.log(post.id);
        console.log(comments.length);
        setLocalComments(comments);
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };

    fetchComments();
  }, [sectionName, post.id, showComments]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (localCommentInput.trim()) {
      try {
        await api.addComment(sectionName, post.id, localCommentInput);
        
        const newComment = {
          content: localCommentInput,
          timestamp: new Date(),
          userId: "" // To be filled in later if needed
        };
        
        setLocalComments([...localComments, newComment]);
        setLocalCommentInput('');
      } catch (error) {
        console.error("Error adding comment: ", error);
      }
    }
  };

  return (
    <div className="post" style={{ margin: '10px', width: '75%', height: '100%', overflow: 'auto', border: '1px solid #ccc', padding: '10px', paddingBottom: '25px', textAlign: 'left' }}>
      <ReactMarkdown>{post.content}</ReactMarkdown>
      <button onClick={toggleComments} style={{ marginTop: '10px', width: '100%' }}>
        {showComments ? 'Hide Comments' : `Comments (${localComments.length})`}
      </button>
      {showComments && (
        <div className="comments" style={{ marginTop: '10px' }}>
          {localComments.map((comment, commentIndex) => (
            <Comment key={commentIndex} comment={comment} />
          ))}
          <div style={{ marginTop: '10px' }}>
            <ReactMarkdown>{localCommentInput}</ReactMarkdown>
          </div>
          <textarea
            value={localCommentInput}
            placeholder="Write a comment (Markdown supported)..."
            style={{ marginTop: '10px', width: '100%', fontSize: '0.9em', color: 'black' }}
            onChange={(e) => setLocalCommentInput(e.target.value)}
          />
          <button
            style={{ marginTop: '5px', width: '100%', fontSize: '0.9em' }}
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;
