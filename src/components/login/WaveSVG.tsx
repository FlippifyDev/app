import {
    Animated,
    Dimensions,
} from "react-native";
import { Path, Svg } from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

const WaveSvg = ({ animatedValue, isDarker = false }: { animatedValue: Animated.Value, isDarker?: boolean }) => {
    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -120],
    });

    return (
        <Animated.View
            style={{
                position: "absolute",
                bottom: isDarker ? 5 : -100,
                left: 0,
                right: 0,
                transform: [{ translateY }],
            }}
        >
            <Svg
                width={screenWidth}
                height={screenHeight}
                viewBox="0 0 1440 800"
                preserveAspectRatio="none"
            >
                <Path
                    d="M0,200 C240,150 480,250 720,200 C960,150 1200,250 1440,200 L1440,800 L0,800 Z"
                    fill={isDarker ? "#f5f5f5" : "#ffffff"}
                    fillOpacity="1"
                />
            </Svg>
        </Animated.View>
    );
};


export default WaveSvg;
