import CheckboxField from "@/components/CheckboxField";
import ScrollViewKeyboardAwareContainer from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { StyleSheet, View, Text } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function CoordinationEyeMovement() {
    const [answers, setAnswers] = useState({
        coordination: false,
        eyeControl: false,
        normalEyeMovement: false,
    });

    const handleChange = (key: keyof typeof answers) => {
        setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = () => {
        console.log("Coordination and eye movement assessment submitted", answers);
        router.push("/(testing-form)/glasgow-scale");
    };

    return (
        <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: "flex-start" }}>
            <View style={styles.inputContainer}>
                <CheckboxField
                    label="Получается ли дотронуться пальцем до кончика носа обеими руками с открытыми и закрытыми глазами?"
                    checked={answers.coordination}
                    onChange={() => handleChange('coordination')}
                    style={{ borderBottomWidth: 0 }}
                />
                <CheckboxField
                    label="Может ли пациент смотреть из стороны в сторону и вверх-вниз, не двигая головой или шеей, без двоения в глазах?"
                    checked={answers.eyeControl}
                    onChange={() => handleChange('eyeControl')}
                    style={{ borderBottomWidth: 0 }}
                />
                <CheckboxField
                    label="Нормальны ли наблюдаемые экстраокулярные движения глаз?"
                    checked={answers.normalEyeMovement}
                    onChange={() => handleChange('normalEyeMovement')}
                />
                <SubmitButton text="Далее" onPress={handleSubmit} style={{ marginTop: 20 }} />
            </View>
        </ScrollViewKeyboardAwareContainer>
    );
}

const styles = StyleSheet.create({
    guideText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    inputContainer: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 20,
    },
});
