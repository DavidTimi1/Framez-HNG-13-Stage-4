import { SkeletonPost } from '@/components/PostsLoader';
import { useScreenTransition } from '@/hooks/use-screen-transitions';
import { safeConvex } from '@/lib/convex-error';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { Camera } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { api } from '../../convex/_generated/api';
import { PostCard } from '../components/PostCard';
import { THEME } from '../lib/theme';
import { useAuthStore } from '../store/authStore';
import { Image } from 'react-native';


type RangeTS = {
  before?: number;
  after?: number;
}

export const HomeFeed: React.FC = () => {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [timeRange, setTimeRange] = useState<RangeTS>({});
  const hasFullRangeSet = !!timeRange.before && !!timeRange.after;

  const scrollRef = useRef<ScrollView>(null);

  const posts = useQuery(api.posts.getPostsPaginated, { limit: hasFullRangeSet ? undefined : 50, ...timeRange }) || undefined;
  const lastTimestamp = posts?.slice(-1)?.[0]?.timestamp;
  const latestTimestamp = posts?.[0]?.timestamp;
  const isLoadingPosts = posts === undefined;

  const numberOfNewPosts = useQuery(api.posts.hasNewPostsSince, { timestamp: latestTimestamp })
  const toggleLikeMutation = useMutation(api.posts.toggleLike);
  const toggleRepostMutation = useMutation(api.posts.toggleRepost);
  const convex = useConvex();
  const route = useRoute();

  const { animatedStyle } = useScreenTransition('left');


  useFocusEffect(
    useCallback(() => {
      if (route.params?.scrollToTop) {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }
    }, [route.params?.scrollToTop])
  );

  if (isLoadingPosts) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={animatedStyle}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Framez</Text>
          </View>
          <SkeletonPost />
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <Animated.View style={animatedStyle}>
        {/* App Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={THEME.primary}
              colors={[THEME.primary]}
            />
          }
          showsVerticalScrollIndicator={false}

          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={THEME.primary} style={{ marginVertical: 16 }} />
            ) : null
          }

        />
      </Animated.View>
    </SafeAreaView>
  );


  async function handleLoadMore() {
    if (!lastTimestamp || loadingMore) return;
    setLoadingMore(true);

    const { data, error } = await safeConvex(() => convex.query(api.posts.getPostsPaginated, {
      before: lastTimestamp,
      limit: 20,
    }));

    if (error) {
      toast.error('Failed to load more posts');
    } else {
      const newLastPost = data.slice(-1)[0];
      newLastPost?.timestamp && setTimeRange({
        after: newLastPost?.timestamp - 1,
      });
    }
    setLoadingMore(false);
  }

  async function handleLoadNewPosts() {
    if (!latestTimestamp) return;

    const { data, error } = await safeConvex(() => convex.query(api.posts.getPostsPaginated, {
      after: latestTimestamp,
      limit: 20,
    }));
    if (error) {
      toast.error('Failed to load new posts');
      return
    }
    const newLatestPost = data[0];
    newLatestPost?.timestamp && setTimeRange({
      before: newLatestPost?.timestamp + 1,
    });
  };


  async function handleLike(postId: string) {
    if (!user) return;

    try {
      await toggleLikeMutation({
        postId: postId as any,
        userId: user._id as any,
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }

  async function handleRepost(postId: string) {
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
  }

  async function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  function renderPost({ item }: { item: any }) {
    return (
      <PostCard
        post={item}
        onLike={handleLike}
        onRepost={handleRepost}
        currentUserId={user?._id || ''}
      />
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Camera size={64} color={THEME.textSecondary} />
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>
          Be the first to share something!
        </Text>
      </View>
    );
  }

  function renderHeader() {
    return (
      <>
        {!!numberOfNewPosts && (
          <View style={styles.newPostsBanner}>
            <Text style={styles.newPostsText} onPress={handleLoadNewPosts}>
              {numberOfNewPosts} New posts available — tap to refresh
            </Text>
          </View>
        )}
        <View style={styles.feedHeader}>
          <Text style={styles.feedTitle}>Latest Posts</Text>
        </View>
      </>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  logo: {
      width: 30,   // slightly bigger than the old 64 icon
      height: 30,
      marginBottom: 5,
  },
  headerTitle: {
    color: THEME.text,
    fontFamily: 'Calligraffitti_Regular',
    fontSize: 28,
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
  newPostsBanner: {
    backgroundColor: THEME.primary,
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  newPostsText: {
    color: 'white',
    fontWeight: '600',
  },

});