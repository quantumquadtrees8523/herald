import React from 'react';
import ReactMarkdown from 'react-markdown';

const Comment = ({ comment }) => {
  return (
    <div className="comment" style={{ fontSize: '0.9em', color: '#000000', marginTop: '5px', marginLeft: '15px' }}>
      <ReactMarkdown>{comment.content}</ReactMarkdown>
      <small style={{ fontSize: '0.8em', color: '#000000' }}>
        {new Date(comment.timestamp.toDate()).toLocaleString()}
      </small>
    </div>
  );
};

export default Comment;
