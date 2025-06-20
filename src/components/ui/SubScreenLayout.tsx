import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export const SubScreenLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const handleBackPress = () => {
        router.back()
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            {children}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingTop: 10,
        paddingHorizontal: 12,
        paddingBottom: 6,
        height: "100%",
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        color: 'black',
    }
});
