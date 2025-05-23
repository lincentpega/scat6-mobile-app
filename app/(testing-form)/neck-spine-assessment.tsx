import CheckboxField from "@/components/CheckboxField";
import ScrollViewKeyboardAwareContainer from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { StyleSheet, View, Text } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import type { ImmediateAssessment } from "@/model/ImmediateAssessment";
import { saveNeckSpineAssessment, loadNeckSpineAssessment } from "@/services/immediateAssessmentStorageService";

export default function NeckSpineAssessment() {
    const [answers, setAnswers] = useState<ImmediateAssessment.NeckSpineAssessment>({
        painAtRest: false,
        tenderness: false,
        fullActiveMovement: false,
        normalStrengthSensation: false,
    });

    useEffect(() => {
        (async () => {
            const saved = await loadNeckSpineAssessment();
            if (saved) setAnswers(saved);
        })();
    }, []);

    const handleChange = (key: keyof typeof answers) => {
        setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async () => {
        await saveNeckSpineAssessment(answers);
        router.push("/(testing-form)/coordination-eye-movement");
    };

    return (
        <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: "flex-start" }}>
            <View style={styles.inputContainer}>
                <Text style={styles.guideText}>
                    У пациентов с не полностью ясным сознанием следует предполагать наличие травмы шейного отдела позвоночника, пока не будет доказано обратное.
                </Text>
                <CheckboxField label="Жалуется на боль в шее в состоянии покоя" checked={answers.painAtRest} onChange={() => handleChange('painAtRest')} style={{ borderBottomWidth: 0 }} />
                <CheckboxField label="Есть болезненность при пальпации" checked={answers.tenderness} onChange={() => handleChange('tenderness')} style={{ borderBottomWidth: 0 }} />
                <CheckboxField label="Если в состоянии покоя боли в шейном отделе НЕТ, то способен ли спортсмен производить полный объем активных движений без боли?" checked={answers.fullActiveMovement} onChange={() => handleChange('fullActiveMovement')} style={{ borderBottomWidth: 0 }} />
                <CheckboxField label="В норме ли сила и чувствительность конечностей?" checked={answers.normalStrengthSensation} onChange={() => handleChange('normalStrengthSensation')} />
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