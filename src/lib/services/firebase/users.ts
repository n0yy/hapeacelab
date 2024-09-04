import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase/config";

export const getUser = async (email: string) => {
  try {
    const userRef = doc(db, "users", email);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user: " + error);
    throw error;
  }
};

export const updatePoints = async (email: string, usedPoints: number) => {
  try {
    const user = await getUser(email);
    if (user) {
      await updateDoc(doc(db, "users", email), {
        points: user.points - usedPoints,
      });
    }
  } catch (error) {
    console.error("Error updating user points: " + error);
  }
};

// TODO: Add histories user
