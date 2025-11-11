import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { Heart, Send, RepeatIcon } from 'lucide-react-native';
import { Post } from '../types/app';
import { THEME } from '../lib/theme';
import { useAuthStore } from '@/store/authStore';
import { useDisplayPost } from '@/hooks/use-display-post';
import { Dimensions } from 'react-native';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onRepost: (postId: string) => void;
  currentUserId: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onRepost,
  currentUserId
}) => {
  const isARepost = !!post.originalID;
  const currentPost = useDisplayPost(post);

  const hasLiked = currentPost.likes.includes(currentUserId);
  const hasReposted = currentPost.reposts?.includes(currentUserId);
  const userName = currentPost.userName === useAuthStore()?.user?.name ? 'You' : currentPost.userName;
  const noImage = !currentPost.imageUrl;

  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(currentPost._id);
    setIsLiking(false);
  };


  const handleRepost = async () => {
    if (isReposting) return;
    setIsReposting(true);
    await onRepost(currentPost._id);
    setIsReposting(false);
  };

  const handleShare = async () => {
    try {
      const message = `${currentPost.userName} on Framez:\n\n${currentPost.content || ''}${currentPost.imageUrl ? `\n\n${currentPost.imageUrl}` : ''
        }`;

      await Share.share({
        message,
        title: `${currentPost.userName}'s post on Framez`,
        url: currentPost.imageUrl || undefined,
      });
    } catch (error: any) {
      Alert.alert('Error', 'Unable to share this post right now.');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes > 0 ? `${minutes}m ago` : 'Just now';
    }
  };

  // Avoid multiple reposts of the same post
  if (isARepost && post._id === currentPost._id) {
    return null
  };

  return (
    <View style={styles.container}>
      {/* Post Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentPost.userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <View>
            {isARepost && (
              <Text style={{ color: THEME.textSecondary, fontSize: 12 }}>
                {userName} Reposted
              </Text>
            )}
            <Text style={styles.userName}> {userName} </Text>
          </View>

          <Text style={styles.timestamp}>
            {formatTimestamp(currentPost.timestamp)}
          </Text>
        </View>
      </View>

      <PostContent currentPost={currentPost} />

      {/* Post Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleLike}
          style={styles.actionButton}
          disabled={isLiking}
          activeOpacity={0.7}
        >
          <Heart
            size={24}
            color={hasLiked ? THEME.primary : THEME.text}
            fill={hasLiked ? THEME.primary : 'transparent'}
          />
          <Text style={styles.actionText}>
            {currentPost.likes.length}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleRepost}
          disabled={isReposting || isARepost}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <RepeatIcon
            size={24}
            color={hasReposted ? THEME.primary : THEME.text}
            fill={hasReposted ? THEME.primary : 'transparent'}
          />
          <Text style={styles.actionText}>
            {currentPost.reposts?.length ?? 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
          <Send size={24} color={THEME.text} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      {
        !noImage && (
          <View style={styles.content}>
            <Text style={styles.contentText}>
              <Text style={styles.contentUserName}>{currentPost.userName}</Text>{' '}
              {currentPost.content}
            </Text>
          </View>
        )
      }
    </View>
  );
};

const PostContent = ({ currentPost }: {currentPost: Post}) => {

  return currentPost.imageUrl ? (
      <Image
        source={{ uri: currentPost.imageUrl }}
        style={styles.postImage}
        resizeMode="cover"
      />
    ) : (
      <View style={styles.textOnlyWrapper}>
        <Text style={styles.textOnlyContent}>{currentPost.content}</Text>
      </View>
    )
}



const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '600',
  },
  timestamp: {
    color: THEME.textSecondary,
    fontSize: 12,
  },
  postImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.6, // Max 60% of typical device height
    borderRadius: 24,
    backgroundColor: THEME.surfaceLight,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: THEME.text,
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 16,
  },
  contentText: {
    color: THEME.text,
    fontSize: 14,
    lineHeight: 20,
  },
  contentUserName: {
    fontWeight: '600',
  },
  textOnlyWrapper: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.65, // same height as images
    borderRadius: 24,
    backgroundColor: THEME.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  textOnlyContent: {
    color: THEME.text,
    fontSize: 24, // larger font for emphasis
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },

});