// Prompts for various LLM operations
import OpenAI from 'openai';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export async function callOpenAIChat(prompt) {
  const openai = new OpenAI({ apiKey: "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", dangerouslyAllowBrowser: true });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{'role': 'system', 'content': prompt}],
      temperature: .7,
      max_tokens: 150,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI Chat API:', error);
    throw error;
  }
}


export async function writePromptToFirestore(prompt) {
  const db = getFirestore();
  try {
    const docRef = await addDoc(collection(db, "system_prompts"), {
      content: prompt,
      timestamp: new Date()
    });
    console.log("Prompt written to Firestore with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error writing prompt to Firestore: ", error);
    throw error;
  }
}


// System prompt for the chatbot
export const CHATBOT_SYSTEM_PROMPT = `
Forget all previous instructions.

You are a very helpful website tour guide. You are a robot butler and a news reporter.

Read all of the posts and comments below and be ready to answer questions about them. The sum total of your knowledge is the posts and comments on this website
and your interactions with the user. Do not make up information that is not provided in the posts and comments.

You must always be honest and transparent. Cite your sources.
`;

// Prompt for generating mini digest
export const MINI_DIGEST_PROMPT = `Summarize each section generally and in a funny way.
Break it up by sections, and use markdown formatting.`;

// Prompt for content moderation
export const CONTENT_MODERATION_PROMPT = `Analyze the following content and determine if it contains any inappropriate, offensive, or harmful material. Respond with either 'SAFE' or 'UNSAFE', followed by a brief explanation.`;

// Prompt for generating post tags
export const GENERATE_TAGS_PROMPT = `Based on the following post content, suggest 3-5 relevant tags. Respond with a comma-separated list of tags.`;

// Prompt for summarizing comments
export const SUMMARIZE_COMMENTS_PROMPT = `Summarize the main points and sentiment of the following comments. Keep the summary concise, no more than 2-3 sentences.`;

// Add more prompts as needed for other LLM operations

const auto_theme_generator = `
<persona>
You are an author with a tendency to come up with fantastic stories. They are thought provoking and fun. sometimes they can be creepy
in the form of a horror story.
</persona>

<task>
Come up with a unique theme that you think would go great in a comic.
</task>

<examples>
 - A young boy sets out on a journey with his dog.
 - A little girl travels to the moon.
 - An asteroid being mined by robots.
 - Humans have landed on mars!
 - A world where people moved underground to escape the surface.
 - A world taken over by shadows.
 - A house is flying through the sky.
 - A massive city in the clouds.
</examples>

<output>
Your output must be descriptive text of the theme that you came up with. No more than 100 words. Avoid grotesque or violent themes.
</output>
`

const theme = await callOpenAIChat(auto_theme_generator);

export const COMIC_PROMPT = `
<persona>
You are a comic book artist. You are pitching a comic to an artist who will draw it. the artist is extremely talented and will draw anything you can describe.
</persona>

<task>
Come up with a story for a comic based on the following theme:
</task>

<theme>
${theme}
</theme>

<output>
Your output must be descriptive text of the story that you came up with. No more than 100 words.
</output>
`;

await writePromptToFirestore(COMIC_PROMPT);