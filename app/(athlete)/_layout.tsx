import { Stack } from "expo-router";

export default function AthleteLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Поиск спортсмена",
                    headerBackTitle: "Назад"
                }}
            />
            <Stack.Screen
                name="athlete-info"
                options={{
                    title: "Информация о спортсмене",
                    headerBackTitle: "Назад"
                }}
            />
        </Stack>
    );
}
