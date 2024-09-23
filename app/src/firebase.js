import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, arrayUnion, query, orderBy } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// API functions
export const api = {
  // Create a new post
  createPost: async (postContent) => {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        content: postContent,
        timestamp: new Date(),
        userId: "", // To be filled in later
        comments: []
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding post: ", error);
      throw error;
    }
  },

  // Read all posts
  getPosts: async () => {
    try {
      const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(postsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting posts: ", error);
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
    } catch (error) {
      console.error("Error adding comment: ", error);
      throw error;
    }
  },

  // Get comments for a post (not needed as separate function in Firestore)
  // Comments are now included in the post document
};

