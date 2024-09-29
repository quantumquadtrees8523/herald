import React from 'react';
import ReactMarkdown from 'react-markdown';

const AISafetyPage = () => {
  const markdownContent = `
# How This Works

## High Level
**All text on the site is indexed by AI**, allowing you to easily query and search through all available content.

## Introduction
**Artificial Intelligence (AI) safety** is a critical concern as we continue to develop more advanced systems. It's essential to ensure that these technologies are developed responsibly.

## Key Points
- Summaries are **automatically generated** for the entire website.
- You can engage with the **chatbot** and ask questions about any part of the website, excluding images.

## Timestamp
*Last updated on September 29, 2024, at 5:28:30 PM (UTC-4)*
  `;

  return (
    <div className="ai-safety-page">
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default AISafetyPage;
