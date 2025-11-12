import React, { useState } from 'react';
import {
  Animated,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Upload, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../components/Button';
import { THEME } from '../lib/theme';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useAuthStore } from '../store/authStore';
import { TabParamList } from '../app/TabNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { useScreenTransition } from '@/hooks/use-screen-transitions';
import { toast } from 'sonner-native';
import { cleanConvexError } from '@/lib/convex-error';

type CreatePostNavigationProp = BottomTabNavigationProp<TabParamList, 'CreateTab'>;

export const CreatePost: React.FC = () => {
  const navigation = useNavigation<CreatePostNavigationProp>();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const createPostMutation = useMutation(api.posts.createPost);
  const { animatedStyle } = useScreenTransition();

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      toast.error(
        'Please grant camera roll permissions to upload images.'
      );
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      // Upload to Cloudinary
      setUploading(true);
      try {
        const url = await uploadToCloudinary(uri);
        setImageUrl(url);
        toast.success('Image uploaded successfully!');

      } catch (error) {
        toast.error('Failed to upload image. Please try again.');
        setImageUri(null);

      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = () => {
    setImageUri(null);
    setImageUrl(null);
  };

  const handleCreatePost = async () => {
    if (!content.trim() && !imageUri) {
      toast.error('Please add some content to your post');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create a post');
      return;
    }

    setCreating(true);

    try {
      await createPostMutation({
        userId: user._id,
        userName: user.name,
        content: content.trim(),
        imageUrl: imageUrl || undefined,
      });

      // Reset form
      setContent('');
      setImageUri(null);
      setImageUrl(null);

      toast.success('Post created successfully!');

      // Navigate to Home tab// In CreatePost.tsx
      navigation.navigate('HomeTab', { scrollToTop: true });

    } catch (error: any) {
      toast.error(cleanConvexError(error) || 'Failed to create post');

    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        style={[styles.content, animatedStyle]}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create a New Post</Text>
        </View>
        {/* Image Upload / Preview */}
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.8}
          disabled={uploading}
          style={imageUri ? styles.imageContainer : styles.imagePlaceholder}
        >
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />

              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color={THEME.primary} />
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={removeImage}
                style={styles.removeButton}
                disabled={uploading}
              >
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.uploadPlaceholderContent}>
              <Upload size={40} color={THEME.textSecondary} />
              <Text style={styles.uploadPlaceholderText}>Tap to add a photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Caption / Text Input */}
        <TextInput
          placeholder="Add a caption..."
          placeholderTextColor={THEME.textSecondary}
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={500}
          style={[styles.textInput, imageUri ? styles.captionInput : {}]}
        />
        <Text style={styles.characterCount}>{content.length}/500</Text>

        {/* Share Button */}
        <Button
          variant="primary"
          onPress={handleCreatePost}
          disabled={creating || uploading || (!content.trim() && !imageUri)}
          loading={creating}
          fullWidth
        >
          Share Post
        </Button>

        <Text style={styles.infoText}>
          Your post will be visible to all Framez users
        </Text>
      </Animated.ScrollView>
    </SafeAreaView>

  );
};


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerTitle: {
    color: THEME.text,
    fontSize: 24,
    fontFamily: 'PoppinsBold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 120, // Space for tab bar
  },
  characterCount: {
    color: THEME.textSecondary,
    fontSize: 12,
    textAlign: 'right',
    marginTop: -8,
  },
  uploadingText: {
    color: THEME.text,
    fontSize: 16,
    marginTop: 12,
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    color: THEME.text,
    fontSize: 16,
  },
  infoText: {
    color: THEME.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.5,
    position: "relative",
    borderRadius: 24,
    backgroundColor: THEME.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  uploadPlaceholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  uploadPlaceholderText: {
    color: THEME.textSecondary,
    fontSize: 16,
  },

  textInput: {
    backgroundColor: THEME.surface,
    color: THEME.text,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },

  captionInput: {
    marginTop: 12,
    minHeight: 60,
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: 24,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: THEME.border,
  },

  imagePreview: {
    width: '100%',
    height: '100%',
    backgroundColor: THEME.surfaceLight,
    resizeMode: 'cover',
  },

  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },

});