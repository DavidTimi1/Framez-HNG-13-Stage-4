import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Camera } from 'lucide-react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { PostCard } from '../components/PostCard';
import { THEME } from '../lib/theme';
import { useAuthStore } from '../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeFeed: React.FC = () => {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all posts with optional limit for pagination
  const posts = useQuery(api.posts.getAllPosts, { limit: 50 });
  const toggleLikeMutation = useMutation(api.posts.toggleLike);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    // Convex automatically refreshes data
    setTimeout(() => setRefreshing(false), 1000);
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
        Be the first to share something!
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.feedHeader}>
      <Text style={styles.feedTitle}>Latest Posts</Text>
    </View>
  );

  if (posts === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Framez</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Framez</Text>
      </View>

      {/* Posts Feed */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={THEME.primary}
            colors={[THEME.primary]}
          />
        }
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
    fontSize: 28,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 120, // Space for tab bar
  },
  feedHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  feedTitle: {
    color: THEME.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyText: {
    color: THEME.textSecondary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: THEME.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});