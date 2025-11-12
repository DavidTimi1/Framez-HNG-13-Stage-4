import React, { ReactNode } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import { Skeleton } from './Skeleton';
import { SkeletonPost } from './PostsLoader';
import { THEME } from '@/lib/theme';
import { useScreenTransition } from '@/hooks/use-screen-transitions';

export const ProfileLoader = () => {
    const { animatedStyle } = useScreenTransition('right');

    return (
        <Animated.View style={animatedStyle}>
            <View>
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <Skeleton style={styles.avatar} />
                        <Skeleton style={styles.name} />
                        <Skeleton style={styles.email} />
                    </View>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <Skeleton style={styles.stat} />
                        <View style={styles.statDivider} />
                        <Skeleton style={styles.stat} />
                    </View>
                </View>

                {/* "Your Posts" Header */}
                <Text style={styles.postsHeaderText}>Your Posts</Text>
            </View>

            <SkeletonPost />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    profileCard: {
        margin: 16,
        borderRadius: 20,
        backgroundColor: THEME.surface,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    profileHeader: { alignItems: 'center', marginBottom: 24 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: THEME.primary + '33',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    name: { backgroundColor: THEME.text, height: 22, marginBottom: 4 },
    email: { backgroundColor: THEME.textSecondary, height: 14 },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: THEME.surfaceLight,
        borderRadius: 16,
        paddingVertical: 12,
        marginBottom: 24,
    },
    stat: { alignItems: 'center', flex: 1, height: 18, backgroundColor: THEME.surfaceLight },
    statDivider: { width: 1, backgroundColor: THEME.border },
    postsHeaderText: {
        height: 14,
        color: THEME.textSecondary,
        marginLeft: 16,
        marginBottom: 8
    },
});