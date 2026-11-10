import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDsAywD7m8F6SqmIvKN8XxGDkw8x2RLn5s",
  authDomain: "ghuri-c35d2.firebaseapp.com",
  projectId: "ghuri-c35d2",
  storageBucket: "ghuri-c35d2.firebasestorage.app",
  messagingSenderId: "754471579740",
  appId: "1:754471579740:web:6a15c3cb197bf8f607f699",
  measurementId: "G-20ZJB94DMY"
};

// Initialize Firebase (prevent re-initialization in Next.js hot reload / SSR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only in browser environments where supported
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore analytics errors in unsupported environments
    });
}

export { app, auth, googleProvider, analytics };

