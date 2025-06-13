import { Colors } from '@/src/theme/colors'
import { View, StyleSheet, Text } from 'react-native'



const PageTitle = ({ text }: { text: string }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        alignItems: "center"
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.text,
    }
})

export default PageTitle
