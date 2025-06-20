import { Colors } from '@/src/theme/colors';
import { formatDate } from '@/src/utils/format';
import { Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart, yAxisSides } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;
const LABEL_WIDTH = 80;

function padSinglePoint(data: { label: string; value: number }[]) {
    if (data.length > 1) return data;

    // only one point: insert a zero-point one day before
    const only = data[0];
    const prevDate = new Date(only.label);
    prevDate.setDate(prevDate.getDate() - 1);

    const prevLabel = prevDate.toISOString().slice(0, 10);
    return [{ label: prevLabel, value: 0 }, only];
}

interface Props {
    data: { value: number; label: string }[];
    setHoverInfo: (value?: number, index?: number) => void;
}

const Chart: React.FC<Props> = ({ data, setHoverInfo }) => {
    const [isHovering, setIsHover] = useState(false);

    const chartData = React.useMemo(() => padSinglePoint(data), [data]);
    const spacing =
        chartData.length > 1
            ? (screenWidth - 32 - 20) / (chartData.length - 1)
            : 0;

    const minValue = React.useMemo(
        () => Math.min(...chartData.map((pt) => pt.value)),
        [chartData]
    );

    const yOffset = minValue < 0 ? Math.abs(minValue) : 0;


    const height = 220;
    const initialSpacing = 0;
    const heightOffset = 20;
    const widthOffset = 50;

    return (
        <View style={[styles.chartWrapper, { overflow: 'visible' }]}>
            {/* Area */}
            <LineChart
                data={chartData}
                width={screenWidth - widthOffset}
                height={height}
                hideDataPoints
                initialSpacing={initialSpacing}
                spacing={spacing} 
                areaChart
                startFillColor={Colors.houseBlue}
                endFillColor={Colors.background}
                startOpacity={0.5}
                endOpacity={0.1}

                thickness={0}
                color="transparent"

                xAxisColor="transparent"
                xAxisLabelTextStyle={{ color: 'transparent' }}

                showVerticalLines={false}
                rulesLength={0}

                yAxisSide={yAxisSides.RIGHT}
                yAxisColor="transparent"
                yAxisOffset={yOffset}
                yAxisExtraHeight={heightOffset}
                yAxisLabelContainerStyle={styles.yAxisLabelContainer}
                yAxisTextStyle={styles.yAxisLabelText}

                isAnimated
                animationDuration={1200}

            />

            <View style={StyleSheet.absoluteFill}>
                <LineChart
                    data={chartData}
                    width={screenWidth - widthOffset}
                    height={height}
                    hideDataPoints
                    initialSpacing={initialSpacing}
                    spacing={spacing}

                    areaChart={false}

                    thickness={2}
                    color={Colors.houseBlue}

                    xAxisColor="transparent"
                    xAxisLabelTextStyle={{ color: 'transparent' }}

                    showVerticalLines={false}
                    rulesLength={0}

                    yAxisSide={yAxisSides.RIGHT}
                    yAxisColor="transparent"
                    yAxisExtraHeight={heightOffset}
                    yAxisLabelContainerStyle={styles.yAxisLabelContainer}
                    hideYAxisText

                    unFocusOnPressOut={true}

                    isAnimated
                    animationDuration={1200}
                    getPointerProps={(items: { pointerIndex: number, pointerX: number, pointerY: number }) => {
                        if (isHovering) {
                            const pt = chartData[items.pointerIndex];
                            setHoverInfo(pt.value, items.pointerIndex);
                        } else {
                            setHoverInfo(undefined, undefined);
                        }
                    }}

                    pointerConfig={{
                        pointerEvents: 'auto',
                        pointerLabelHeight: 20,
                        shiftPointerLabelY: -10,
                        autoAdjustPointerLabelPosition: false,
                        pointerColor: Colors.houseBlue,
                        shiftPointerLabelX: -LABEL_WIDTH / 2.7,

                        pointerLabelComponent: (items: any) => {
                            const { label } = items[0] || {};
                            if (label == null) return null;

                            return (
                                <View
                                    style={styles.tooltip}
                                >
                                    <Text style={styles.tooltipLabel}>{formatDate(new Date(label as string).toDateString())}</Text>
                                </View>
                            );
                        },

                        onResponderGrant: () => {
                            setIsHover(true);
                        },
                        onResponderEnd: () => {
                            setIsHover(false);
                            setHoverInfo(undefined, undefined);
                        }
                    }}
                />
            </View>
        </View>
    );
};


export default Chart;

const styles = StyleSheet.create({
    chartWrapper: {
        flexDirection: 'row-reverse',
    },
    yAxisLabelContainer: {
        paddingRight: 12,
    },
    yAxisLabelText: {
        color: Colors.text,
        fontSize: 10
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: "transparent",
        justifyContent: 'center',
        alignItems: 'center',
        width: LABEL_WIDTH,
    },
    tooltipLabel: {
        color: Colors.text,
        fontSize: 12,
    },
    tooltipValue: {
        color: Colors.houseBlue,
        fontSize: 14,
        fontWeight: '600',
    },
});

