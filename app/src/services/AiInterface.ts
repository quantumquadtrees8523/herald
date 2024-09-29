import OpenAI from 'openai';
import { getFirestore, collection, addDoc, getDocs, Firestore } from 'firebase/firestore';
import { dbCollectionToSectionName, Post, ChatContext, SectionName, DbCollectionName } from '../data_shapes';
import api from './Firebase';

import { CHATBOT_SYSTEM_PROMPT, MINI_DIGEST_PROMPT } from '../prompts';

class AiInterface {
  db: Firestore;
  context_window: ChatContext[];
  openai: OpenAI;
  
  private constructor() {
    const apiKey = "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"
    this.openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true  });
    this.context_window = [];
    this.db = getFirestore();
  }

  static async create(): Promise<AiInterface> {
    const instance = new AiInterface();
    const firestoreContext: ChatContext[] = await instance.getFirestoreContext();
    firestoreContext.forEach(document => {
      instance.addToContextWindow(document);
    });
    return instance;
  }

  async readFromFirestore(db_col_name: DbCollectionName): Promise<ChatContext[]> {
    const all_data: Post[] = [];
      const collectionRef = collection(this.db, db_col_name);
      const querySnapshot = await getDocs(collectionRef);
      querySnapshot.forEach((doc) => {
        all_data.push({
          section: db_col_name,
          id: doc.id,
          ...doc.data()
        } as Post);
      });
      // Convert Post[] to ChatContext[] for context_window
      const contextData: ChatContext[] = all_data.map(post => ({
        role: 'user',
        content: JSON.stringify(post)
      }));
      return contextData;
  }

  async getFirestoreContext(): Promise<ChatContext[]> {
    const contextData: ChatContext[] = [];
    for (const db_col_name of Object.keys(dbCollectionToSectionName) as DbCollectionName[]) {
      const sectionContextData = await this.readFromFirestore(db_col_name);
      contextData.push(...sectionContextData);
    }
    return contextData;
  }

  async chat(userMessage: string, temperature: number = 1, max_tokens: number = 1500): Promise<string> {
    console.log("Chatting...");
    const gpt_response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {role: 'system', content: CHATBOT_SYSTEM_PROMPT},
        ...this.context_window,
        {role: 'user', content: userMessage},
      ],
      temperature,
      max_tokens,
      response_format: {type: 'text'}
    });
    const gpt_text: string | null = gpt_response.choices[0].message.content;
    if (gpt_text) {
      // console.log(this.context_window);
      this.recordQueryAndResponse(userMessage, gpt_text);
      this.addToContextWindow({role: 'user', content: userMessage});
      this.addToContextWindow({role: 'assistant', content: gpt_text});
      return gpt_text;
    } else {
      this.recordQueryAndResponse(userMessage, 'gpt returned null.');
      return 'Left speechless :O !!!';
    }
  }
  

  addToContextWindow(context:ChatContext): void {
    this.context_window.push(context);
  }

  async recordQueryAndResponse(query: string, response: string) {
    // TODO: Record query and response in Firestore
    const queryRef = collection(this.db, 'queries_and_responses');
    await addDoc(queryRef, {query, response, timestamp: new Date()});
    return;
  }

  async getMiniDigest() {
    console.log("Getting mini digest.");
    const firestoreContext = await this.getFirestoreContext();
    const messages = [
      {role: 'system', content: CHATBOT_SYSTEM_PROMPT},
      {role: 'user', content: MINI_DIGEST_PROMPT + JSON.stringify(firestoreContext)},
    ]
    try {
      console.log("Sending request to OpenAI.");
      const gpt_response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {role: 'system', content: CHATBOT_SYSTEM_PROMPT},
          {role: 'user', content: MINI_DIGEST_PROMPT + JSON.stringify(firestoreContext)},
      ],
      temperature: 0.7,
      max_tokens: 700,
      response_format: {type: 'text'}
    });
    console.log(gpt_response);
    const gpt_text: string | null = gpt_response.choices[0].message.content;
    console.log("successfully got mini digest.");
    return gpt_text;
    } catch (error) {
      console.error("Error getting mini digest: ", error);
      return "Error getting mini digest.";
    }
  }

  async getBlogSummary(): Promise<string> {
    const userMessage = "Please provide a summary of the recent blog posts in a click-baity way.";
    return this.chat(userMessage);
  }

  async getGraffitiSummary(): Promise<string> {
    const userMessage = "Can you summarize the recent graffiti posts in a click-baity way.";
    return this.chat(userMessage);
  }

  async getTodoNycSummary(): Promise<string> {
    const userMessage = "Please give me a summary of the recent 'todo nyc' posts in a click-baity way.";
    return this.chat(userMessage);
  }

  async createImage(prompt: string): Promise<string> {
    try {
      const response = await this.openai.images.generate({
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });
      
      const image_url = response.data[0].url;
      if (!image_url) {
        throw new Error("No image URL returned from the API");
      }
      return image_url;
    } catch (error) {
      console.error("Error creating image:", error);
      throw error;
    }
  }

  async createThreePartComic(theme: string): Promise<string[]> {
    try {
      const comicPrompts = [
        `Create the first panel of a three-part comic about ${theme}. Make it intriguing and set up the story.`,
        `Create the second panel of a three-part comic about ${theme}. This should be the development or conflict of the story.`,
        `Create the final panel of a three-part comic about ${theme}. This should provide a resolution or punchline to the story.`
      ];

      const comicImages: string[] = [];

      for (const prompt of comicPrompts) {
        const imageUrl = await this.createImage(prompt);
        comicImages.push(imageUrl);
      }

      console.log("Comic images created");
      await api.writeImageSet(comicImages, theme);
      console.log("Comic images written to Firebase");
      return comicImages;
    } catch (error) {
      console.error("Error creating three-part comic:", error);
      if (error instanceof Error) {
        console.error("OpenAI error message:", error.message);
      }
      throw error;
    }
  }
}

export default AiInterface;
