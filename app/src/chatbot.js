import OpenAI from 'openai';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

class ChatbotWrapper {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true  });
    this.context = [];
    this.db = getFirestore();
  }

  ingestData(data) {
    console.log('Ingesting data:', data);
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Invalid data format. Expected non-empty array.');
      return;
    }
    this.context = data.flatMap(({ section, items }) => {
      if (!Array.isArray(items)) {
        console.error(`Invalid items for section ${section}. Expected array.`);
        return [];
      }
      return items.map(item => ({
        role: 'system',
        content: `Section: ${section}\nContent: ${item.content}\nComments: ${(item.comments || []).map(comment => comment.content).join(', ')}`
      }));
    });
    console.log('Ingested context:', this.context);
  }

  async chat(userMessage) {
    console.log('Current context:', this.context);
    const updateStatus = (status) => {
      console.log(status);
    };
    updateStatus('Preparing request...');
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that can discuss the content and comments from all sections of the app, including blog posts, insane New York news, and graffiti. Respond based on the context provided. Limit your responses to a maximum of 50 words.'
      },
      ...this.context,
      { role: 'user', content: userMessage }
    ];

    try {
      updateStatus('Sending request to AI...');
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        // max_tokens: 50,
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
}

export default ChatbotWrapper;
