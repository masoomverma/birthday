import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const fetchChoices = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "choices"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.allowMasoom) {
        console.log("👀 Choice:", data.choice);
      } else {
        console.log("🚫 Masoom is not allowed to see this choice.");
      }
    });
  } catch (error) {
    console.error("❌ Error fetching choices: ", error);
  }
};

export { fetchChoices };
