import { IChartData } from '@/src/models/chart';
import { Colors } from '@/src/theme/colors';
import { formatDate } from '@/src/utils/format';
import { LinearGradient, vec } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    LayoutChangeEvent,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { Area, CartesianChart, Line, PointsArray, useChartPressState } from 'victory-native';



interface Props {
    chartData: IChartData[];
    height?: number;
    setX?: (value: string) => void;
    setY?: (value?: number, profit?: number) => void;
    rightPaddingCustom?: number;
    leftPaddingCustom?: number;
}

const Chart: React.FC<Props> = ({
    chartData,
    height,
    setX,
    setY,
}) => {
    if (!height) {
        height = 220;
    }
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

    const timeValues = chartData.map((item) => item.time);

    const data = chartData.map((item, index) => ({
        ...item,
        time: index,
    }));
    
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(Dimensions.get('window').width);
        };

        const subscription = Dimensions.addEventListener('change', handleResize);
        return () => {
            subscription.remove();
        };
    }, []);

    const graphXDimensions = {
        start: 0,
        end: windowWidth,
    };

    const toolTipDomainY = 10;

    const rightPadding = 10;
    const leftPadding = 5;

    const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 }, snap: false });
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [tooltipLinePosition, setTooltipLinePosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [tooltipData, setTooltipData] = useState<{ time: string; price: string }>({
        time: '',
        price: '',
    });
    const tooltipRef = useRef<View | null>(null);
    const [tooltipWidth, setTooltipWidth] = useState(0);
    const [toolTipTextPadding, setToolTipTextPadding] = useState(tooltipWidth / 2);
    const [allChartPoints, setAllChartPoints] = useState<PointsArray>();
    const [pulsingDotInCurrentPos, setPulsingDotInCurrentPos] = useState(true);


    const DATA = useMemo(
        () =>
            data?.map((point) => ({
                time: point.time,
                price: point.value,
            })) ?? [],
        [data],
    );

    const pulsingAnimOpacity = useRef(new Animated.Value(1)).current;
    const pulsingDotAnimated = useRef(new Animated.Value(0)).current;
    const [pulsingDotPos, setPulsingDotPos] = useState({
        x: graphXDimensions.end / 2,
        y: height / 2,
    });
    const [pulsingDotIndex, setPulsingDotIndex] = useState<number>(DATA.length - 1);

    useEffect(() => {
        if (DATA.length - 1 !== pulsingDotIndex && !isActive) {
            setPulsingDotIndex(DATA.length - 1);
        }
    }, [DATA, pulsingDotIndex, isActive]);

    useEffect(() => {
        let animation: Animated.CompositeAnimation;

        if (!isActive) {
            animation = Animated.loop(
                Animated.sequence([
                    Animated.parallel([
                        Animated.timing(pulsingDotAnimated, {
                            toValue: 2,
                            duration: 2000,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulsingAnimOpacity, {
                            toValue: 0,
                            duration: 2000,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.parallel([
                        Animated.timing(pulsingDotAnimated, {
                            toValue: 0,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulsingAnimOpacity, {
                            toValue: 1,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
            );
            animation.start();
        } else {
            Animated.parallel([
                Animated.timing(pulsingDotAnimated, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(pulsingAnimOpacity, {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ]).start();
        }

        return () => {
            if (animation) animation.stop();
        };
    }, [isActive, pulsingDotAnimated, pulsingAnimOpacity]);

    const [isTooltipEnabled, setIsTooltipEnabled] = useState(false);
    const [currentDataLength, setCurrentDataLength] = useState(data?.length ?? 0);

    useEffect(() => {
        if (data?.length !== currentDataLength) {
            setCurrentDataLength(data?.length as number);
            setIsTooltipEnabled(false);
            state.isActive.value = false;
        }
    }, [data, currentDataLength, state]);

    useEffect(() => {
        if (isActive) return;

        const lastDataPoint = data[data.length - 1];
        if (!lastDataPoint) return;

        const toolTipDomainX = {
            start: 0,
            end: graphXDimensions.end,
        };


        if (toolTipDomainX.end !== tooltipPosition.x || toolTipDomainY !== tooltipPosition.y) {
            const formattedDate = formatDate(new Date(timeValues[lastDataPoint.time]).toDateString());
            setTooltipPosition({ x: toolTipDomainX.end, y: toolTipDomainY });
            setTooltipLinePosition({ x: toolTipDomainX.end, y: toolTipDomainY });
            setTooltipData({
                time: formattedDate,
                price: lastDataPoint.value.toFixed(2),
            });
            setX?.(lastDataPoint.time.toString());
            setY?.(undefined, undefined);
        }
    }, [
        isActive,
        data,
        setX,
        setY,
        toolTipDomainY,
        tooltipPosition,
        tooltipLinePosition,
        tooltipData,
        timeValues,
        graphXDimensions.end
    ]);

    const timeToolTipWasLastUpdated = useRef<Date>(new Date());

    function ToolTip({
        x,
        y,
        xValue,
        yValue,
    }: {
        x: SharedValue<number>;
        y: SharedValue<number>;
        xValue: SharedValue<number>;
        yValue: SharedValue<number>;
    }) {
        useEffect(() => {
            if (!isActive) return;

            const currentTime = new Date();
            const updateDelay = 100;

            if (!isTooltipEnabled) {
                state.isActive.value = false;
                setIsTooltipEnabled(true);
                return;
            } else if (DATA.length !== currentDataLength) {
                setCurrentDataLength(DATA.length);
                state.isActive.value = false;
                setIsTooltipEnabled(false);
                return;
            }
            const formattedDate = formatDate(new Date(timeValues[xValue.value]).toDateString());
            const toolTipDomainX = {
                start: 0,
                end: graphXDimensions.end,
            };

            if (x.value !== tooltipLinePosition.x) {
                if (x.value >= toolTipDomainX.end - toolTipTextPadding) {
                    setTooltipPosition({
                        x: toolTipDomainX.end - tooltipWidth,
                        y: toolTipDomainY,
                    });
                } else if (x.value <= toolTipDomainX.start + toolTipTextPadding) {
                    setTooltipPosition({ x: toolTipDomainX.start, y: toolTipDomainY });
                } else {
                    setTooltipPosition({ x: x.value - toolTipTextPadding, y: toolTipDomainY });
                }

                setTooltipLinePosition({ x: x.value, y: toolTipDomainY });
                void Haptics.selectionAsync();
            }

            setTooltipData({
                time: formattedDate,
                price: yValue.value.toFixed(2) ?? 0,
            });

            if (currentTime.getTime() - timeToolTipWasLastUpdated.current.getTime() <= updateDelay)
                return;

            // Find the corresponding profit value from chartData
            let currentProfit = 0;

            // Method 1: Find by matching time value (most accurate)
            const currentTimeValue = timeValues[xValue.value];
            const matchingDataPoint = chartData.find(dataPoint => dataPoint.time === currentTimeValue);

            if (matchingDataPoint) {
                currentProfit = matchingDataPoint.profit;
            } else {
                // Method 2: Fallback - find by index if time matching fails
                const dataIndex = Math.round(xValue.value);
                if (dataIndex >= 0 && dataIndex < chartData.length) {
                    currentProfit = chartData[dataIndex].profit;
                }
            }


            setX?.(xValue.value.toString());
            setY?.(yValue.value, currentProfit);

            timeToolTipWasLastUpdated.current = currentTime;
        }, [
            x.value,
            y.value,
            xValue,
            yValue
        ]);

        return null;
    }

    function PulsingDot({
        x,
        y,
    }: {
        x: number | SharedValue<number>;
        y: number | SharedValue<number>;
    }) {
        useEffect(() => {
            if (!x || !y) {
                return;
            }

            if (typeof x === 'object' && typeof y === 'object') {
                if (x.value !== pulsingDotPos.x || y.value !== pulsingDotPos.y) {
                    setPulsingDotPos({ x: x.value, y: y.value });
                }
            } else if (x !== pulsingDotPos.x || y !== pulsingDotPos.y) {
                setPulsingDotPos({ x: x as number, y: y as number });
            }
        }, [x, y]);
        return null;
    }


    function SetChartPositions({ points }: { points: PointsArray }) {
        useEffect(() => {
            if (allChartPoints && allChartPoints[allChartPoints.length - 1] === points[points.length - 1])
                return;
            setAllChartPoints(points);
            setPulsingDotInCurrentPos(false);
            const currentIndex = allChartPoints?.findIndex(
                (point) => point.x === pulsingDotPos.x && point.y === pulsingDotPos.y,
            );
            if (currentIndex !== undefined) {
                setPulsingDotIndex(currentIndex);
            }
        }, [points]);
        return null;
    }


    useEffect(() => {
        // Only run animation when chart is released and dot is not in current position
        if (isActive || pulsingDotInCurrentPos || !allChartPoints || allChartPoints.length === 0) {
            return;
        }

        const currentIndex = allChartPoints?.findIndex(
            (point) => point.x === pulsingDotPos.x && point.y === pulsingDotPos.y,
        );

        setPulsingDotIndex(currentIndex ?? 0);

        if (currentIndex === -1 || currentIndex >= allChartPoints.length - 1) {
            setPulsingDotInCurrentPos(true);
            return;
        }

        let index = currentIndex;
        let totalPoints = allChartPoints.length;
        let interval = 1;

        const numPointsToSnapTo = 10;

        if (totalPoints > numPointsToSnapTo) {
            interval = Math.floor(totalPoints / numPointsToSnapTo);
        }

        const moveInterval = setInterval(() => {
            if (index < totalPoints - 1) {
                index += interval;
                if (index >= totalPoints) {
                    index = totalPoints - 1;
                }

                setPulsingDotPos({
                    x: allChartPoints[index].x,
                    y: allChartPoints[index].y as number,
                });
            } else {
                clearInterval(moveInterval);
                setPulsingDotInCurrentPos(true);
            }
        }, 1);

        return () => {
            clearInterval(moveInterval);
        };
    }, [isActive, allChartPoints, pulsingDotInCurrentPos, pulsingDotPos]);


    const handleTooltipLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setTooltipWidth(width);
        setToolTipTextPadding(width / 2);
    };

    const prices = DATA.map((d) => d.price);
    const WINDOW_SIZE = DATA.length;
    const minValue = Math.min(...prices);
    const maxValue = Math.max(...prices);
    const minValueMemo = useMemo(() => minValue, [minValue]);
    const maxValueMemo = useMemo(() => maxValue, [maxValue]);
    const numberOfPoints = DATA.length;
    const lastIndex = numberOfPoints - 1;
    const firstIndex = Math.max(0, lastIndex - WINDOW_SIZE + 1);

    return (
        <View style={{ height: height, width: graphXDimensions.end } as ViewStyle}>
            <CartesianChart
                data={DATA as any[]}
                xKey="time"
                yKeys={['price'] as any[]}
                domainPadding={{ top: 20, bottom: 20, left: leftPadding, right: rightPadding }}
                chartPressState={state as any}
                domain={{
                    x: [firstIndex, lastIndex],
                    y: [minValueMemo, maxValueMemo],
                }}
            >
                {({ points, chartBounds }) => {
                    const lastPos = points.price[points.price.length - 1];
                    const firstSegment = points.price.slice(0, pulsingDotIndex + 1);
                    const secondSegment = points.price.slice(pulsingDotIndex);

                    return (
                        <React.Fragment>
                            <Area points={firstSegment} y0={chartBounds.bottom}>
                                <LinearGradient
                                    start={vec(0, 0)}
                                    end={vec(0, chartBounds.bottom)}
                                    colors={['rgba(0, 208, 255, 0.4)', 'rgba(0, 208, 255, 0.01)']}
                                />
                            </Area>
                            <React.Fragment>
                                <Line
                                    points={firstSegment}
                                    strokeWidth={DATA.length > 300 ? 2.2 : 2.6}
                                    curveType="monotoneX"
                                    color={Colors.houseBlue}
                                    opacity={0.9}
                                />
                                <Line
                                    points={secondSegment}
                                    strokeWidth={DATA.length > 300 ? 2.2 : 2.6}
                                    curveType="monotoneX"
                                    color={Colors.gray}
                                    opacity={0.7}
                                />
                            </React.Fragment>
                            {isActive ? (
                                <React.Fragment>
                                    <ToolTip
                                        x={state.x.position}
                                        xValue={state.x.value}
                                        y={state.y.price.position}
                                        yValue={state.y.price.value}
                                    />
                                    <PulsingDot x={state.x.position} y={state.y.price.position} />
                                    <SetChartPositions points={points.price} />
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {pulsingDotInCurrentPos && (
                                        <PulsingDot x={lastPos?.x as number} y={lastPos?.y as number} />
                                    )}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    );
                }}
            </CartesianChart>
            {isActive && tooltipData && (
                <React.Fragment>
                    <View
                        ref={tooltipRef}
                        style={[styles.tooltip, { top: tooltipPosition.y - 30, left: tooltipPosition.x }]}
                        onLayout={handleTooltipLayout}
                    >
                        <Text style={styles.tooltipText}>{tooltipData.time}</Text>
                    </View>
                    <View
                        style={[
                            styles.tooltipLine,
                            { top: tooltipLinePosition.y, left: tooltipLinePosition.x },
                            { height: height },
                        ]}
                    />
                </React.Fragment>
            )}

            <React.Fragment>
                <View
                    style={[
                        styles.pulsingDotStatic,
                        {
                            top: pulsingDotPos.y - 4,
                            left: pulsingDotPos.x - 4,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.pulsingDotAnimated,
                        {
                            transform: [{ scale: pulsingDotAnimated }],
                            opacity: pulsingAnimOpacity,
                            top: pulsingDotPos.y - 10,
                            left: pulsingDotPos.x - 10,
                        },
                    ]}
                />
            </React.Fragment>
        </View>
    );
};


const styles = StyleSheet.create({
    tooltip: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: 8,
        padding: 8,
        zIndex: 10,
    },
    tooltipText: {
        color: '#888',
        fontSize: 14,
        fontWeight: 'bold',
    },
    tooltipLine: {
        position: 'absolute',
        top: 40,
        left: 45,
        height: '100%',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#888',
        fontWeight: 'bold',
        marginLeft: -1,
    },
    pulsingDotStatic: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.houseBlue,
    },
    pulsingDotAnimated: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: Colors.houseBlue,
    },
    transactionDot: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 2,
    },
    transactionTooltip: {
        position: 'absolute',
        backgroundColor: 'rgba(35, 35, 35, 1)',
        borderRadius: 5,
        padding: 8,
        zIndex: 10,
        gap: 8,
    },
});

export default Chart;
