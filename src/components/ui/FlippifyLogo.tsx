import { Text } from '@ui-kitten/components'
import React from 'react'
import { StyleSheet, TextStyle } from 'react-native'

interface Props {
    style?: TextStyle,
}
const FlippifyLogo: React.FC<Props> = ({ style }) => {
    return (
        <Text category="h1" style={[styles.title, style]}>
            flippify
        </Text>
    )
}


const styles = StyleSheet.create({
    title: {
        fontFamily: "Lato_900Black_Italic",
        fontSize: 48,
        fontStyle: "italic",
        color: "black",
    },
})
export default FlippifyLogo
