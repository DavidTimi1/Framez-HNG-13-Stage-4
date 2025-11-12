import React, { ReactNode } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { LogOutIcon, Camera, Settings, ArrowLeftIcon, ChevronLeftIcon } from 'lucide-react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { PostCard } from './PostCard';
import { useAuthStore } from '../store/authStore';
import { THEME } from '../lib/theme';
import { useScreenTransition } from '@/hooks/use-screen-transitions';
import { ProfileLoader } from '@/components/ProfileLoader';

export const ProfileContent = ({
  userId,
}: {
  userId: string
}) => {
  const { user: currentUser } = useAuthStore();
  const userPosts = useQuery(
    api.posts.getUserPosts,
    userId ? { userId } : 'skip'
  );
  const myProfile = currentUser?._id === userId;
  const user = useQuery(api.users.getUserDetails, userId ? { userId } : 'skip');

  const totalLikes = useQuery(api.posts.getUserTotalLikes, userId ? { userId } : 'skip');
  const toggleLikeMutation = useMutation(api.posts.toggleLike);
  const toggleRepostMutation = useMutation(api.posts.toggleRepost);
  const { animatedStyle } = useScreenTransition('right');

  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    try {
      await toggleLikeMutation({ postId: postId as any, userId: currentUser._id as any });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleRepost = async (postId: string) => {
    if (!currentUser) return;
    try {
      await toggleRepostMutation({
        postId: postId as any,
        userId: currentUser._id as any,
        userName: currentUser.name as any,
      });
    } catch (error) {
      console.error('Failed to toggle repost:', error);
    }
  };

  const renderPost = ({ item }: { item: any }) => (
    <PostCard post={item} onLike={handleLike} onRepost={handleRepost} currentUserId={currentUser?._id || ''} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Camera size={64} color={THEME.textSecondary} />
      <Text style={styles.emptyText}>No posts yet</Text>
      <Text style={styles.emptySubtext}>
        {
          myProfile ? (
            "Share your first moments"
          ) : (
            `${user?.name} has not made any Posts yet`
          )
        }
      </Text>
    </View>
  );

  const renderHeader = () => {
    if (!user) return null;

    return (
      <View>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{userPosts?.length || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalLikes || 0}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>
        </View>

        {/* "Your Posts" Header */}
        <Text style={styles.postsHeaderText}>Your Posts</Text>
      </View>
    );
  };

  if (!currentUser) {
    return (
        <Animated.View style={animatedStyle}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Please login to view profile</Text>
          </View>
        </Animated.View>
    );
  }

  if (userPosts === undefined) {
    return (
      <ProfileLoader />
    );
  }

  return (
      <Animated.View style={animatedStyle}>

        <FlatList
          data={userPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

      </Animated.View>
  );
};



const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: THEME.surfaceLight,
    backgroundColor: THEME.background,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: { color: THEME.text, fontSize: 24, fontFamily: 'PoppinsBold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: 120 },
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
  avatarText: { color: THEME.primary, fontSize: 40, fontWeight: '700' },
  name: { color: THEME.text, fontSize: 22, fontWeight: '700', marginBottom: 4 },
  email: { color: THEME.textSecondary, fontSize: 14 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: THEME.surfaceLight,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '700', color: THEME.text },
  statLabel: { fontSize: 12, color: THEME.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: THEME.border },
  postsHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textSecondary,
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: '600', color: THEME.textSecondary, marginTop: 12, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: THEME.textSecondary, marginTop: 6, textAlign: 'center' },
});
