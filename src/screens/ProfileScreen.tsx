import React from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LogOut, Camera, Settings } from 'lucide-react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { PostCard } from '../components/PostCard';
import { useAuthStore } from '../store/authStore';
import { THEME } from '../lib/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonPost } from '@/components/PostsLoader';
import { useScreenTransition } from '@/hooks/use-screen-transitions';
import { ProfileLoader } from '@/components/ProfileLoader';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthStore();

  const userPosts = useQuery(
    api.posts.getUserPosts,
    user ? { userId: user._id as any } : 'skip'
  );

  const toggleLikeMutation = useMutation(api.posts.toggleLike);
  const toggleRepostMutation = useMutation(api.posts.toggleRepost);
  const { animatedStyle } = useScreenTransition('right');

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      await toggleLikeMutation({ postId: postId as any, userId: user._id as any });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleRepost = async (postId: string) => {
    if (!user) return;
    try {
      await toggleRepostMutation({
        postId: postId as any,
        userId: user._id as any,
        userName: user.name as any,
      });
    } catch (error) {
      console.error('Failed to toggle repost:', error);
    }
  };

  const renderPost = ({ item }: { item: any }) => (
    <PostCard post={item} onLike={handleLike} onRepost={handleRepost} currentUserId={user?._id || ''} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Camera size={64} color={THEME.textSecondary} />
      <Text style={styles.emptyText}>No posts yet</Text>
      <Text style={styles.emptySubtext}>Share your first moment!</Text>
    </View>
  );

  const renderHeader = () => {
    if (!user) return null;

    const totalLikes =
      userPosts?.reduce((sum, post) => sum + post.likes.length, 0) || 0;

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
              <Text style={styles.statValue}>{totalLikes}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>
        </View>

        {/* "Your Posts" Header */}
        <Text style={styles.postsHeaderText}>Your Posts</Text>
      </View>
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={animatedStyle}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Please login to view profile</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (userPosts === undefined) {
    return (
      <ProfileLoader />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={animatedStyle}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>

          {/* Floating Logout */}
          <TouchableOpacity style={styles.logoutButtonContainer} onPress={handleLogout}>
            <LogOut size={24} color={THEME.primary} />
          </TouchableOpacity>
        </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
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
  headerTitle: { color: THEME.text, fontSize: 24, fontWeight: '700' },
  logoutButtonContainer: {
    backgroundColor: THEME.surfaceLight,
    padding: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
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
