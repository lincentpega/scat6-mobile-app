import { Stack } from "expo-router";

export default function TestingFormLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="athlete-info"
        options={{
          title: "Информация о спортсмене"
        }}
      />
      <Stack.Screen
        name="brain-injury-history"
        options={{
          title: "История травм головного мозга"
        }}
      />
    </Stack>
  );
}