import OpenAI from 'openai';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import api from './firebase';

class ChatbotWrapper {
  constructor() {
    const apiKey = "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"
    this.openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true  });
    this.context = [];
    this.db = getFirestore();
  }

  ingestData(data) {
    if (typeof data !== 'object' || data === null) {
      console.error('Invalid data format. Expected non-null object.');
      return;
    }
    this.context = Object.entries(data).flatMap(([section, items]) => {
      if (!Array.isArray(items)) {
        console.error(`Invalid items for section ${section}. Expected Array.`);
        return [];
      }
      return items.map(item => ({
        role: 'system',
        content: `Section: ${section}\nContent: ${item.content}\nComments: ${(item.comments || []).map(comment => comment.content).join(', ')}`
      }));
    });
    console.log('Ingested context:', this.context);
  }

  async chat(userMessage, temperature = 0.7, max_tokens = 50) {
    const updateStatus = (status) => {
      console.log(status);
    };
    updateStatus('Fetching latest data...');
    const data = await api.getAllDataForMiniDigest();
    this.ingestData(data);
    console.log('Current context:', this.context);

    updateStatus('Preparing request...');
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that can discuss the content and comments from all sections of the app, including blog posts, todo nyc, and graffiti. Respond only based on the context provided. Limit your responses to a maximum of 50 words.'
      },
      ...this.context,
      { role: 'user', content: userMessage }
    ];

    try {
      updateStatus('Sending request to AI...');
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature,
        max_tokens
      });

      updateStatus('Processing AI response...');
      const aiResponse = response.choices[0].message.content;

      // Record query and response
      await this.recordQueryAndResponse(userMessage, aiResponse);

      return aiResponse;
    } catch (error) {
      console.error('Error in ChatbotWrapper:', error);
      updateStatus('Error occurred');
      return 'Sorry, I encountered an error while processing your request.';
    } finally {
      updateStatus('');
    }
  }

  async recordQueryAndResponse(query, response) {
    try {
      const docRef = await addDoc(collection(this.db, 'queries_and_responses'), {
        query: query,
        response: response,
        timestamp: new Date()
      });
      console.log('Query and response recorded with ID: ', docRef.id);
    } catch (error) {
      console.error('Error recording query and response: ', error);
    }
  }

  async getMiniDigest() {
    try {
      // Create a prompt for the mini digest
      const prompt = "Create a brief summary of the most important or interesting points from the following data. Split it up by section in markdown format. Keep it concise, around 2-3 sentences per section:";

      // Generate the mini digest using the chat method
      const miniDigest = await this.chat(prompt, 0.1, 5000);

      // Trim any extra whitespace and return the result
      return miniDigest.trim();
    } catch (error) {
      console.error('Error generating mini digest:', error);
      return 'Unable to generate mini digest at this time.';
    }
  }
}

export default ChatbotWrapper;
