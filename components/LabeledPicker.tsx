import { Picker, PickerProps } from "@react-native-picker/picker";
import { View, Platform, StyleSheet } from "react-native";
import InputLabel from "./InputLabel";

interface LabeledPickerProps extends PickerProps {
    children: React.ReactNode;
    label: string;
    style?: any;
}

const LabeledPicker = ({ children, label, style, ...props }: Readonly<LabeledPickerProps>) => {
    return (
        <View style={style}>
            <InputLabel label={label} />
            {Platform.OS === 'android' ? (
                <View style={styles.androidPickerWrapper}>
                    <Picker
                        {...props}
                        style={styles.androidPicker}
                    >
                        {children}
                    </Picker>
                </View>
            ) : (
                <Picker {...props}>
                    {children}
                </Picker>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    androidPickerWrapper: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        backgroundColor: 'white',
        marginBottom: 0,
        marginTop: 0,
        marginHorizontal: 0,
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 0,
    },
    androidPicker: {
        height: 50,
        paddingHorizontal: 15,
        backgroundColor: 'transparent',
    },
});

export default LabeledPicker;