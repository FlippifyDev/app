import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export const SubScreenLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const handleBackPress = () => {
        router.back()
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <ScrollView
                style={styles.scrollWrapper}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 12,
        paddingBottom: 6,
        backgroundColor: Colors.background
    },
    scrollContent: {
        flex: 1,
        paddingBottom: 32
    },
    scrollWrapper: {
        flex: 1,
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
