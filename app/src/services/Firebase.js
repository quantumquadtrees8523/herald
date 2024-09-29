import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, arrayUnion, query, orderBy, getDoc, limit } from 'firebase/firestore';
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const auth = getAuth(app);
const storage = getStorage(app);

let currentUser = null;

// Determine if we're on localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Function to get the correct path
const getPath = (collectionName) => {
  const prefix = isLocalhost ? '' : '';
  return `${prefix}${collectionName}`;
};

// Sign in anonymously
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Error signing in anonymously:", error);
  });

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("User is signed in with ID:", user.uid);
  } else {
    currentUser = null;
    console.log("User is signed out");
  }
});

// Helper function to log events
const logAnalyticsEvent = (eventName, eventParams) => {
  logEvent(analytics, eventName, eventParams);
};


// API functions
export const api = {
  // Create a new post
  createPost: async (postContent, collectionName) => {
    try {
      if (!currentUser) throw new Error("User not authenticated");
      const docRef = await addDoc(collection(db, getPath(collectionName)), {
        content: postContent,
        timestamp: new Date(),
        userId: currentUser.uid,
        comments: []
      });
      logAnalyticsEvent('create_post', { post_id: docRef.id });
      // updateChatbotContext();
      return docRef.id;
    } catch (error) {
      console.error("Error adding post: ", error);
      logAnalyticsEvent('error', { action: 'create_post', error: error.message });
      throw error;
    }
  },

  // Read all posts
  getPosts: async (sectionName) => {
    try {
      const postsQuery = query(collection(db, getPath(sectionName)), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(postsQuery);
      logAnalyticsEvent(`get_posts_${sectionName}`, { count: querySnapshot.size });
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

  // Get comments for a creative writing (not needed as separate function in Firestore)
  // Comments are now included in the creative writing document
  getComments: async (sectionName, postId) => {
    try {
      const postRef = doc(db, getPath(sectionName), postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        logAnalyticsEvent(`get_${sectionName}_comments`, { post_id: postId });
        return postDoc.data().comments || [];
      } else {
        logAnalyticsEvent('error', { action: `get_${sectionName}_comments`, error: `No such ${sectionName} writing`});
        return [];
      }
    } catch (error) {
      console.error(`Error get_${sectionName}_comments: `, error);
      logAnalyticsEvent('error', { action: `get_${sectionName}_comments`, error: error.message });
      throw error;
    }
  },

  // Add a comment to a post
  addComment: async (sectionName, postId, commentContent) => {
    try {
      if (!currentUser) throw new Error("User not authenticated");
      const postRef = doc(db, getPath(sectionName), postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          content: commentContent,
          timestamp: new Date(),
          userId: currentUser.uid
        })
      });
      logAnalyticsEvent('add_comment', { post_id: postId });
    } catch (error) {
      console.error("Error adding comment: ", error);
      logAnalyticsEvent('error', { action: 'add_comment', error: error.message });
      throw error;
    }
  },

  getAllDataForMiniDigest: async () => {
    const allData = {};

    for (const section of ["blog", "todo nyc", "graffiti", "ai safety"]) {
      const data = await api.getPosts(section);
      allData[section] = data;
    }
    return allData;
  },

  // New function to write sets of images and associated text to Firebase Storage
  writeImageSet: async (images, associatedText) => {
    try {
      if (!currentUser) throw new Error("User not authenticated");
      console.log("Writing image set to Firestore");
      console.log("Images URLs:", images);
      const timestamp = new Date().getTime();
      const setId = crypto.randomUUID();

      // Create a document in Firestore to store the image set information
      const docRef = await addDoc(collection(db, 'imageSets'), {
        userId: currentUser.uid,
        timestamp: new Date(),
        imageUrls: images,
        associatedText: associatedText,
        setId: setId
      });
      
      console.log("Image set uploaded to Firestore");
      logAnalyticsEvent('write_image_set', { set_id: docRef.id });
      
      return docRef.id;
    } catch (error) {
      console.error("Error writing image set: ", error);
      logAnalyticsEvent('error', { action: 'write_image_set', error: error.message });
      throw error;
    }
  },

  // Function to get a random image set from Firebase
  getImageSet: async () => {
    try {
      const imageSetsRef = collection(db, 'imageSets');
      const querySnapshot = await getDocs(imageSetsRef);

      if (querySnapshot.empty) {
        console.log('No image sets found');
        return null;
      }

      const imageSets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const randomIndex = Math.floor(Math.random() * imageSets.length);
      const imageSet = imageSets[randomIndex];

      logAnalyticsEvent('get_random_image_set', { set_id: imageSet.id });
      console.log("Random image set:", imageSet);
      return imageSet;
    } catch (error) {
      console.error("Error getting random image set: ", error);
      logAnalyticsEvent('error', { action: 'get_random_image_set', error: error.message });
      throw error;
    }
  },

  // Function to get a specific image set from Firebase based on ID
  getImageSetById: async (imageSetId) => {
    try {
      const imageSetRef = doc(db, 'imageSets', imageSetId);
      const imageSetDoc = await getDoc(imageSetRef);

      if (!imageSetDoc.exists()) {
        console.log('No image set found with the given ID');
        return null;
      }

      const imageSet = { id: imageSetDoc.id, ...imageSetDoc.data() };

      logAnalyticsEvent('get_image_set_by_id', { set_id: imageSet.id });
      return imageSet;
    } catch (error) {
      console.error("Error getting image set by ID: ", error);
      logAnalyticsEvent('error', { action: 'get_image_set_by_id', error: error.message });
      throw error;
    }
  }
}

export default api;