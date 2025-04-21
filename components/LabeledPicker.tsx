import { Picker, PickerProps } from "@react-native-picker/picker";
import { View, Text } from "react-native";
import InputLabel from "./InputLabel";

interface LabeledPickerProps extends PickerProps {
    children: React.ReactNode;
    label: string;
}

const LabeledPicker = ({ children, label, ...props }: Readonly<LabeledPickerProps>) => {
    return (
        <View>
            <InputLabel label={label} />
            <Picker {...props}>
                {children}
            </Picker>
        </View>
    );
};

export default LabeledPicker;