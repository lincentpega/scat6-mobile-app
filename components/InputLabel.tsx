import { StyleSheet, Text, View } from "react-native";

const InputLabel = ({ label, required }: { label: string, required?: boolean }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            {required && <Text style={styles.required}>*</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: "#000000",
    },
    required: {
        fontSize: 16,
        marginBottom: 4,
        marginLeft: 2,
        color: "#FF0000",
    }
});

export default InputLabel;