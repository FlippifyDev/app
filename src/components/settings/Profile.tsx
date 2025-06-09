import { IUser } from '@/src/models/user';
import { Colors } from '@/src/theme/colors';
import { Avatar, Layout, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

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
        <Layout style={styles.container}>
            <Avatar
                style={styles.avatar}
                source={{ uri: image }}
            />
            <Layout style={styles.textContainer}>
                <Text category="h4" style={styles.name}>{username}</Text>
                <Text appearance="hint" category="s1" style={styles.email}>{email}</Text>
            </Layout>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: Colors.cardBackground,
        alignItems: 'center',
        justifyContent: 'flex-start',
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
        backgroundColor: Colors.cardBackground,
    },
    name: {
        marginBottom: 4,
        color: Colors.text,
    },
    email: {
        color: Colors.textSecondary,
    },
    button: {
        width: 150,
    },
});
