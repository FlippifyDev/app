import Card from "@/src/components/ui/Card";
import PageTitle from "@/src/components/ui/PageTitle";
import { SubScreenLayout } from "@/src/components/ui/SubScreenLayout";
import { Colors } from "@/src/theme/colors";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

export default function PlansScreen() {
    const socials = [
        {
            name: 'Discord',
            icon: <MaterialCommunityIcons name="discord" size={26} style={styles.icon} />,
            url: 'https://discord.gg/aHXVSMkmpk',
        },
        {
            name: 'Instagram',
            icon: <FontAwesome name="instagram" size={26} style={styles.icon} />,
            url: 'https://www.instagram.com/_flippify',
        },
        {
            name: 'Twitter',
            icon: <FontAwesome name="twitter" size={26} style={styles.icon} />,
            url: 'https://twitter.com/flippify_io',
        },
        {
            name: 'LinkedIn',
            icon: <FontAwesome name="linkedin" size={26} style={styles.icon} />,
            url: 'https://www.linkedin.com/company/flippify',
        },
        {
            name: 'ProductHunt',
            icon: <FontAwesome name="product-hunt" size={26} style={styles.icon} />,
            url: 'https://www.producthunt.com/products/flippify',
        },
        {
            name: 'Youtube',
            icon: <FontAwesome name="youtube" size={26} style={styles.icon} />,
            url: 'https://www.youtube.com/@elliot-coiley',
        },
    ];

    return (
        <SubScreenLayout>
            <PageTitle text="Socials" />
            <View style={[styles.container, { marginTop: 24 }]}>
                {socials.slice(0, 2).map((social) => (
                    <Card key={social.name} style={{ width: "48%" }} externalHref={social.url}>
                        <View style={styles.accountContainer}>
                            {social.icon}
                            <Text style={styles.label}>{social.name}</Text>
                        </View>
                    </Card>
                ))}
            </View>
            <View style={styles.container}>
                {socials.slice(2, 4).map((social) => (
                    <Card key={social.name} style={{ width: "48%" }} externalHref={social.url}>
                        <View style={styles.accountContainer}>
                            {social.icon}
                            <Text style={styles.label}>{social.name}</Text>
                        </View>
                    </Card>
                ))}
            </View>
            <View style={styles.container}>
                {socials.slice(4, 6).map((social) => (
                    <Card key={social.name} style={{ width: "48%" }} externalHref={social.url}>
                        <View style={styles.accountContainer}>
                            {social.icon}
                            <Text style={styles.label}>{social.name}</Text>
                        </View>
                    </Card>
                ))}
            </View>
        </SubScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "center"
    },
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