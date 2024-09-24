import React from 'react';
import ReactMarkdown from 'react-markdown';

const AISafetyPage = () => {
  const markdownContent = `
# AI Safety

## Introduction
Artificial Intelligence (AI) safety is a critical concern as we develop more advanced AI systems.

## Key Points
1. Alignment: Ensuring AI systems behave in ways aligned with human values.
2. Robustness: Developing AI that performs reliably in various environments.
3. Transparency: Creating AI systems that are interpretable and explainable.

## Challenges
- Unpredictable emergent behaviors
- Potential misuse of AI technologies
- Long-term implications of superintelligent AI

## Conclusion
Addressing AI safety is crucial for the responsible development of AI technologies.
  `;

  return (
    <div className="ai-safety-page">
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default AISafetyPage;
