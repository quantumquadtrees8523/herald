import React from 'react';
import ReactMarkdown from 'react-markdown';
import Comment from './comment';
import { api } from './firebase';

const Post = ({ post, onToggleComments, showComments, commentInput, onCommentInputChange, onAddComment }) => {
  // console.log(commentInput);
  return (
    <div className="post" style={{ margin: '10px', width: '75%', height: '100%', overflow: 'auto', border: '1px solid #ccc', padding: '10px', paddingBottom: '25px' }}>
      <ReactMarkdown>{post.content}</ReactMarkdown>
      <button onClick={() => onToggleComments(post.id)} style={{ marginTop: '10px', width: '100%' }}>
        {showComments ? 'Hide Comments' : 'Comments'}
      </button>
      {showComments && (
        <div className="comments" style={{ marginTop: '10px' }}>
          {post.comments && post.comments.map((comment, commentIndex) => (
            <Comment key={commentIndex} comment={comment} />
          ))}
          <textarea
            value={commentInput || ''}
            placeholder="Write a comment (Markdown supported)..."
            style={{ marginTop: '10px', width: '100%', fontSize: '0.9em', color: 'black' }}
            onChange={(e) => onCommentInputChange(e.target.value)}
          />
          <button
            style={{ marginTop: '5px', width: '100%', fontSize: '0.9em' }}
            onClick={() => onAddComment(commentInput)}
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;
