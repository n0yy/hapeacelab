import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";
import { v4 as uuidv4 } from "uuid";

export async function saveHistory(
  userEmail: string,
  service: string,
  data: any
) {
  const userDocRef = doc(db, "users", userEmail);
  const historyDocRef = doc(userDocRef, "histories", service);
  const newEntryRef = doc(historyDocRef, "entries", uuidv4());

  await setDoc(newEntryRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getHistories(userEmail: string, service: string) {
  const historyCollectionRef = collection(
    db,
    "users",
    userEmail,
    "histories",
    service,
    "entries"
  );
  const querySnapshot = await getDocs(historyCollectionRef);
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export async function getHistory(
  userEmail: string,
  service: string,
  uuid: string
) {
  const historyDocRef = doc(
    db,
    "users",
    userEmail,
    "histories",
    service,
    "entries",
    uuid
  );

  const docSnapshot = await getDoc(historyDocRef);

  console.log(docSnapshot);
  return docSnapshot.data();
}
