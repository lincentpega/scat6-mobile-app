import ScrollViewKeyboardAwareContainer from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { router } from "expo-router";
import { StyleSheet, View, Text } from "react-native";

export default function RedFlags() {
    const handleSubmit = () => {
        console.log("Submit red flags");
        router.push("/(athlete)/athlete-info");
    }

    return (
        <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: "flex-start" }}>
            <View style={styles.inputContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.guideText}>Вывести из игры для немедленного медицинского осмотра и транспортировки в больницу/медицинский центр, если имеется любой из признаков</Text>
                </View>
                <View style={styles.listContainer}>
                    <Text style={styles.text}>• Боль в шее или болезненность</Text>
                    <Text style={styles.text}>• Припадок или конвульсии</Text>
                    <Text style={styles.text}>• Двоение в глазах</Text>
                    <Text style={styles.text}>• Потеря сознания</Text>
                    <Text style={styles.text}>• Слабость или покалывание/жжение в рука или ногах</Text>
                    <Text style={styles.text}>• Ухудшение состояния сознания</Text>
                    <Text style={styles.text}>• Рвота</Text>
                    <Text style={styles.text}>• Тяжелая или нарастающая головная боль</Text>
                    <Text style={styles.text}>• Чрезмерное беспокойство, возбуждение или агрессия</Text>
                    <Text style={styles.text}>• ШКГ &lt; 15</Text>
                    <Text style={styles.text}>• Видимая деформация черепа</Text>
                </View>
                <SubmitButton text="Далее" onPress={handleSubmit} style={{ marginTop: 20 }} />
            </View>
        </ScrollViewKeyboardAwareContainer>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "left",
    },
    guideText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "darkred",
        textAlign: "center",
    },
    textContainer: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    listContainer: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        marginVertical: 10,
    },
})