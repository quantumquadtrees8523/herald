import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, arrayUnion, query, orderBy } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";

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
// const analytics = getAnalytics(app);

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

