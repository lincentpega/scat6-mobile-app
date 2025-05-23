import { Stack } from "expo-router";

export default function TestingFormLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="athlete-info"
        options={{
          title: "Информация о спортсмене",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="brain-injury-history"
        options={{
          title: "История травм головного мозга",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="observable-signs"
        options={{
          title: "Видимые признаки",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="red-flags"
        options={{
          title: "Красные флаги",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="neck-spine-assessment"
        options={{
          title: "Оценка шейного отдела позвоночника",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="coordination-eye-movement"
        options={{
          title: "Координация и движение глаз",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="glasgow-scale"
        options={{
          title: "Шкала Глазго",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="maddocks-questions"
        options={{
          title: "Вопросы Мэддокса",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="symptoms-questionary"
        options={{
          title: "Опросник симптомов",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="orientation-assessment"
        options={{
          title: "Оценка ориентации",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="short-term-memory"
        options={{
          title: "Кратковременная память",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="concentration-numbers"
        options={{
          title: "Концентрация внимания (числа)",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="concentration-months"
        options={{
          title: "Концентрация внимания (месяцы)",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="coordination-and-balance-info"
        options={{
          title: "Координация и равновесие: вводная",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="coordination-and-balance-mbess"
        options={{
          title: "Координация и равновесие: mBESS",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="tandem-walk"
        options={{
          title: "Тандемная походка",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="tandem-walk-dual"
        options={{
          title: "Походка с двумя задачами (опционально)",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="tandem-walk-result"
        options={{
          title: "Тандемная походка: итог",
          headerBackTitle: "Назад"
        }}
      />
      <Stack.Screen
        name="deferred-memory"
        options={{
          title: "Отложенная память",
          headerBackTitle: "Назад"
        }}
      />
    </Stack>
  );
}