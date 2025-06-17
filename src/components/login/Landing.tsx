import { LinearGradient } from 'expo-linear-gradient'
import React, { useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'
import WaveSvg from '../login/WaveSVG'

const Landing = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    return (
        <LinearGradient
            colors={["#2171ce", "#269de1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBackground}
        >
            <WaveSvg animatedValue={animatedValue} isDarker={true} />
            <WaveSvg animatedValue={animatedValue} isDarker={false} />
        </LinearGradient>
    )
}

export default Landing


const styles = StyleSheet.create({
    gradientBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },

});