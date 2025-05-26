import { Stack } from "expo-router";

export default function DraftsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Черновики",
                    headerBackTitle: "Назад"
                }}
            />
        </Stack>
    );
}
