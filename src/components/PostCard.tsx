import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MessageCircle, Send } from 'lucide-react-native';
import { Post } from '../types/app';
import { THEME } from '../lib/theme';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  currentUserId: string;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike,
  currentUserId 
}) => {
  const hasLiked = post.likes.includes(currentUserId);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(post._id);
    setIsLiking(false);
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

  return (
    <View style={styles.container}>
      {/* Post Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(post.timestamp)}
          </Text>
        </View>
      </View>

      {/* Post Image - Max 60% of screen height, rounded */}
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

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
            {post.likes.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <MessageCircle size={24} color={THEME.text} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7}>
          <Send size={24} color={THEME.text} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>
          <Text style={styles.contentUserName}>{post.userName}</Text>{' '}
          {post.content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
    height: 400, // Max 60% of typical device height
    borderRadius: 24,
    backgroundColor: THEME.surfaceLight,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 16,
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
});