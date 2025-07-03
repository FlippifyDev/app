import { IUser } from '@/src/models/user';
import { Colors } from '@/src/theme/colors';
import { formatUsername } from '@/src/utils/format';
import { Avatar, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ProfileLetters from '../ui/ProfileLetters';

interface Props {
    user?: IUser
}
export default function Profile({ user }: Props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        if (!user) return;

        setUsername(user.username as string);
        setEmail(user.email as string);
        setImage(user.metaData?.image as string);

    }, [user])

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text category="h4" style={styles.name}>{username}</Text>
                <Text appearance="hint" style={styles.email}>{email}</Text>
            </View>

            {image && (
                <Avatar
                    style={styles.avatar}
                    source={{ uri: image }}
                />
            )}
            {!image && (
                <ProfileLetters text={formatUsername(username)} containerStyle={styles.avatar} textStyle={{fontSize: 20}}/>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        borderRadius: 16,
        width: '100%',
    },
    avatar: {
        width: 72,
        height: 72,
        backgroundColor: Colors.cardBackground
    },
    textContainer: {
        flexShrink: 1,
    },
    name: {
        marginBottom: 1,
        color: Colors.text,
    },
    email: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    button: {
        width: 150,
    },
});
