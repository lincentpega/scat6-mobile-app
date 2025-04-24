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
      <Stack.Screen
        name="observable-signs"
        options={{
          title: "Видимые признаки"
        }}
      />
      <Stack.Screen
        name="red-flags"
        options={{
          title: "Красные флаги"
        }}
      />
      <Stack.Screen
        name="neck-spine-assessment"
        options={{
          title: "Оценка шейного отдела позвоночника"
        }}
      />
      <Stack.Screen
        name="coordination-eye-movement"
        options={{
          title: "Координация и движение глаз"
        }}
      />
      <Stack.Screen
        name="glasgow-scale"
        options={{
          title: "Шкала Глазго"
        }}
      />
      <Stack.Screen
        name="maddocks-questions"
        options={{
          title: "Вопросы Мэддокса"
        }}
      />
    </Stack>
  );
}