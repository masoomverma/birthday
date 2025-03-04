import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const saveChoice = async (choice, allowMasoom) => {
  try {
    await addDoc(collection(db, "choices"), {
      choice: choice,
      allowMasoom: allowMasoom,
      timestamp: new Date(),
    });
    console.log("✅ Choice saved successfully!");
  } catch (error) {
    console.error("❌ Error saving choice: ", error);
  }
};

export { saveChoice };
