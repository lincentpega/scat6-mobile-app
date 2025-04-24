import { KeyboardAvoidingView, StyleSheet, Platform, ScrollView, ScrollViewProps } from "react-native";

interface ScrollViewKeyboardAwareContainerProps extends ScrollViewProps {
    children: React.ReactNode;
}

const ScrollViewKeyboardAwareContainer = ({ children, ...props }: ScrollViewKeyboardAwareContainerProps) => {
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            enabled={Platform.OS === "ios"}
        >   
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                {...props}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#ffffff",
        paddingVertical: 20,
    },
    content: {
        flexGrow: 1,
    },
});

export default ScrollViewKeyboardAwareContainer;
