import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons"; 
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export const SubScreenLayout = ({ children }: { children: React.ReactNode }) => {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text style={styles.backText}>Back</Text>
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
        paddingTop: 40,
        paddingHorizontal: 16,
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
