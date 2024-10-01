import { db } from "@/utils/firebase/config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const sendFeedback = async (data: any) => {
  const docRef = doc(db, "feedback", uuidv4());
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return {
    status: 200,
    message: "Success sending feedback",
  };
};
