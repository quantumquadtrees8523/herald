import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, arrayUnion, query, orderBy } from 'firebase/firestore';
import { getAnalytics, logEvent } from "firebase/analytics";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYhFdp_CTuw7MyWptkNXu4G7PyyKB-pjk",
  authDomain: "herald-9c3c1.firebaseapp.com",
  projectId: "herald-9c3c1",
  storageBucket: "herald-9c3c1.appspot.com",
  messagingSenderId: "1057295222413",
  appId: "1:1057295222413:web:f16851f59d8c3c3c6644c4",
  measurementId: "G-CHE5MMCEJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Helper function to log events
const logAnalyticsEvent = (eventName, eventParams) => {
  logEvent(analytics, eventName, eventParams);
};

// API functions
export const api = {
  // Create a new post
  createPost: async (postContent) => {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        content: postContent,
        timestamp: new Date(),
        userId: "suryad96", // To be filled in later
        comments: []
      });
      logAnalyticsEvent('create_post', { post_id: docRef.id });
      return docRef.id;
    } catch (error) {
      console.error("Error adding post: ", error);
      logAnalyticsEvent('error', { action: 'create_post', error: error.message });
      throw error;
    }
  },

  createCreativeWriting: async (creativeInput) => {
    try {
      const docRef = await addDoc(collection(db, "creative_writing"), {
        content: creativeInput,
        timestamp: new Date(),
        userId: "suryad96", // To be filled in later
        comments: []
      });
      logAnalyticsEvent('create_creative_writing', { writing_id: docRef.id });
      return docRef.id;
    } catch (error) {
      console.error("Error adding creative writing: ", error);
      logAnalyticsEvent('error', { action: 'create_creative_writing', error: error.message });
      throw error;
    }
  },

  // Read all posts
  getPosts: async () => {
    try {
      const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(postsQuery);
      logAnalyticsEvent('get_posts', { count: querySnapshot.size });
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting posts: ", error);
      logAnalyticsEvent('error', { action: 'get_posts', error: error.message });
      throw error;
    }
  },

  // Read all creative writings
  getCreativeWritings: async () => {
    try {
      const creativeWritingsQuery = query(collection(db, "creative_writing"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(creativeWritingsQuery);
      logAnalyticsEvent('get_creative_writings', { count: querySnapshot.size });
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting creative writings: ", error);
      logAnalyticsEvent('error', { action: 'get_creative_writings', error: error.message });
      throw error;
    }
  },

  // Add a comment to a post
  addComment: async (postId, commentContent) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          content: commentContent,
          timestamp: new Date(),
          userId: "" // To be filled in later
        })
      });
      logAnalyticsEvent('add_comment', { post_id: postId });
    } catch (error) {
      console.error("Error adding comment: ", error);
      logAnalyticsEvent('error', { action: 'add_comment', error: error.message });
      throw error;
    }
  },

  // Add a comment to a creative writing
  addCreativeComment: async (creativeWritingId, commentContent) => {
    try {
      const creativeWritingRef = doc(db, "creative_writing", creativeWritingId);
      await updateDoc(creativeWritingRef, {
        comments: arrayUnion({
          content: commentContent,
          timestamp: new Date(),
          userId: "" // To be filled in later
        })
      });
      logAnalyticsEvent('add_creative_comment', { writing_id: creativeWritingId });
    } catch (error) {
      console.error("Error adding creative comment: ", error);
      logAnalyticsEvent('error', { action: 'add_creative_comment', error: error.message });
      throw error;
    }
  },

  // Get comments for a creative writing (not needed as separate function in Firestore)
  // Comments are now included in the creative writing document
  getCreativeComments: async (creativeWritingId) => {
    try {
      const creativeWritingRef = doc(db, "creative_writing", creativeWritingId);
      const creativeWritingDoc = await getDocs(creativeWritingRef);
      if (creativeWritingDoc.exists()) {
        logAnalyticsEvent('get_creative_comments', { writing_id: creativeWritingId });
        return creativeWritingDoc.data().comments || [];
      } else {
        console.log("No such creative writing!");
        logAnalyticsEvent('error', { action: 'get_creative_comments', error: 'No such creative writing' });
        return [];
      }
    } catch (error) {
      console.error("Error getting creative comments: ", error);
      logAnalyticsEvent('error', { action: 'get_creative_comments', error: error.message });
      throw error;
    }
  },

  // Create a new graffiti post
  createGraffiti: async (graffitiContent) => {
    try {
      const docRef = await addDoc(collection(db, "graffiti"), {
        content: graffitiContent,
        timestamp: new Date(),
        userId: "suryad96", // To be filled in later
        comments: []
      });
      logAnalyticsEvent('create_graffiti', { graffiti_id: docRef.id });
      return docRef.id;
    } catch (error) {
      console.error("Error adding graffiti: ", error);
      logAnalyticsEvent('error', { action: 'create_graffiti', error: error.message });
      throw error;
    }
  },

  // Read all graffiti posts
  getGraffiti: async () => {
    try {
      const graffitiQuery = query(collection(db, "graffiti"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(graffitiQuery);
      logAnalyticsEvent('get_graffiti', { count: querySnapshot.size });
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting graffiti: ", error);
      logAnalyticsEvent('error', { action: 'get_graffiti', error: error.message });
      throw error;
    }
  },

  // Add a comment to a graffiti post
  addGraffitiComment: async (graffitiId, commentContent) => {
    try {
      const graffitiRef = doc(db, "graffiti", graffitiId);
      await updateDoc(graffitiRef, {
        comments: arrayUnion({
          content: commentContent,
          timestamp: new Date(),
          userId: "" // To be filled in later
        })
      });
      logAnalyticsEvent('add_graffiti_comment', { graffiti_id: graffitiId });
    } catch (error) {
      console.error("Error adding graffiti comment: ", error);
      logAnalyticsEvent('error', { action: 'add_graffiti_comment', error: error.message });
      throw error;
    }
  },

  // ... existing functions ...
};
