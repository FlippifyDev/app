import { IUser } from '@/src/models/user';
import { Colors } from '@/src/theme/colors';
import { Avatar, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

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
                <Text appearance="hint" category="s1" style={styles.email}>{email}</Text>
            </View>
            <Avatar
                style={styles.avatar}
                source={{ uri: image }}
            />
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
    },
    button: {
        width: 150,
    },
});
