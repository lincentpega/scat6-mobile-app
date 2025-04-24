import { StyleSheet, View, Text, StyleProp, ViewStyle } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const CheckboxField = ({ label, checked, onChange, style }: { label: string, checked: boolean, onChange: (checked: boolean) => void, style?: StyleProp<ViewStyle> }) => {
    return (
        <View style={[styles.container, style]} >
            <Text style={styles.label}>{label}</Text>
            <View style={styles.checkboxContainer}>
                <BouncyCheckbox
                    onPress={onChange}
                    isChecked={checked}
                    unFillColor="#000000"
                    fillColor="#000000"
                    disableText={true}
                    style={{ flex: 1 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        flex: 5,
        padding: 10,
        borderRightWidth: 1,
        borderColor: "grey",
    },
    checkboxContainer: {
        flex: 1,
        alignItems: "center",
    },
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "grey",
    },
});

export default CheckboxField;