import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import Card from "../../ui/Card";


const Plans = () => {
    return (
        <Card style={{ width: "48%" }} href="plans">
            <View style={styles.accountContainer}>
                <Ionicons name="leaf-outline" size={26} style={styles.icon} />
                <Text style={styles.label}>Plans</Text>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    accountContainer: {
        flexDirection: "column",
        borderRadius: 16,
        padding: 8,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    label: {
        color: Colors.text,
        fontSize: 16,
        marginTop: 8,
        fontWeight: "bold"
    },
    icon: {
        padding: 16,
        borderRadius: 9999,
        backgroundColor: Colors.cardBackground,
    },
});

export default Plans;