import React from 'react';
import {
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
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { THEME } from '../lib/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthStore();

  // Fetch user's posts
  const userPosts = useQuery(
    api.posts.getUserPosts,
    user ? { userId: user._id as any } : 'skip'
  );

  const toggleLikeMutation = useMutation(api.posts.toggleLike);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    try {
      await toggleLikeMutation({
        postId: postId as any,
        userId: user._id as any,
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const renderPost = ({ item }: { item: any }) => (
    <PostCard
      post={item}
      onLike={handleLike}
      currentUserId={user?._id || ''}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Camera size={64} color={THEME.textSecondary} />
      <Text style={styles.emptyText}>No posts yet</Text>
      <Text style={styles.emptySubtext}>
        Share your first moment!
      </Text>
    </View>
  );

  const renderHeader = () => {
    if (!user) return null;

    const totalLikes = userPosts?.reduce(
      (sum, post) => sum + post.likes.length,
      0
    ) || 0;

    return (
      <View>
        {/* Profile Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {userPosts?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalLikes}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>

          {/* Logout Button */}
          <Button
            variant="outline"
            onPress={handleLogout}
            fullWidth
          >
            <View style={styles.logoutButton}>
              <LogOut size={20} color={THEME.text} />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </Button>
        </View>

        {/* Posts Section Header */}
        <View style={styles.postsHeader}>
          <Text style={styles.postsHeaderText}>Your Posts</Text>
        </View>
      </View>
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please login to view profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (userPosts === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => Alert.alert('Settings', 'Coming soon!')}>
          <Settings size={24} color={THEME.text} />
        </TouchableOpacity>
      </View>

      {/* Profile and Posts */}
      <FlatList
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerTitle: {
    color: THEME.text,
    fontSize: 24,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 120, // Space for tab bar
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: THEME.primary,
  },
  avatarText: {
    color: THEME.text,
    fontSize: 40,
    fontWeight: '700',
  },
  name: {
    color: THEME.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: THEME.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: THEME.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: THEME.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    color: THEME.text,
    fontSize: 16,
  },
  postsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  postsHeaderText: {
    color: THEME.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    color: THEME.textSecondary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: THEME.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});