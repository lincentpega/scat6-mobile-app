import { SessionSteps } from "@/constants/SessionSteps";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const startTesting = async (username: string) => {
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("sessionActive", "true");
    const sessionId = crypto.randomUUID();
    await AsyncStorage.setItem("activeSessionStep-" + sessionId, SessionSteps.username.toString());
}