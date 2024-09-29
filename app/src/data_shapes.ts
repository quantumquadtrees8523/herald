import { Timestamp } from 'firebase/firestore';

export interface Post {
  section: string;
  id: string;
  content: string;
  timestamp: Timestamp;
  comments: Comment[];
}

export interface ChatContext {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface Comment {
  id: string;
  content: string;
  timestamp: Timestamp;
  userId: string;
}

export interface Section {
  id: string;
  name: string;
  posts: Post[];
}

export interface QueryResponse {
  query: string;
  response: string;
  timestamp: Timestamp;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type SectionName = 'blogPosts' | 'graffiti' | 'todo nyc';

export type DbCollectionName = 'blog' | 'graffiti' | 'todo nyc';

export const dbCollectionToSectionName: Record<DbCollectionName, SectionName> = {
  'blog': 'blogPosts',
  'graffiti': 'graffiti',
  'todo nyc': 'todo nyc'
};

export type AppData = {
    [key in SectionName]: Section;
};
