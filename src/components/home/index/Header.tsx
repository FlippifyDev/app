import { useUser } from '@/src/hooks/useUser';
import { Colors } from '@/src/theme/colors';
import { formatUsername } from '@/src/utils/format';
import { Avatar } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FlippifyLogo from '../../ui/FlippifyLogo';
import ProfileLetters from '../../ui/ProfileLetters';

const Header = () => {
    const user = useUser();
    const router = useRouter();
    const [image, setImage] = useState<string>();

    useEffect(() => {
        if (user) {
            setImage(user.metaData?.image as string);
        }
    }, [user])

    function handleOnAvatarClick() {
        router.push("/home/settings");
    }


    return (
        <View style={styles.header}>
            <FlippifyLogo style={{ fontSize: 28, paddingBottom: 1 }} />

            {image && (
                <TouchableOpacity onPress={handleOnAvatarClick}>
                    <Avatar
                        style={styles.avatar}
                        source={{ uri: image }}
                    />
                </TouchableOpacity>
            )}
            {!image && (
                <TouchableOpacity onPress={handleOnAvatarClick}>
                    <ProfileLetters text={formatUsername(user?.username ?? "NA")} containerStyle={styles.avatar} textStyle={{ fontSize: 12 }} />
                </TouchableOpacity>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    avatar: {
        width: 34,
        height: 34,
        backgroundColor: Colors.cardBackground
    },
})
export default Header
