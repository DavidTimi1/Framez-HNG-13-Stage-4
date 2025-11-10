import React, { useState } from 'react';
import {
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

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
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
      console.log({uri})
      
      // Upload to Cloudinary
      setUploading(true);
      try {
        const url = await uploadToCloudinary(uri);
        setImageUrl(url);
        Alert.alert('Success', 'Image uploaded successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload image. Please try again.');
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
    if (!content.trim()) {
      Alert.alert('Error', 'Please add some content to your post');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a post');
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

      Alert.alert('Success', 'Post created successfully!');
      
      // Navigate to Home tab
      navigation.navigate('HomeTab');
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Post</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Text Input */}
        <TextInput
          placeholder="What's on your mind?"
          placeholderTextColor={THEME.textSecondary}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          maxLength={500}
          style={styles.textInput}
        />

        <Text style={styles.characterCount}>
          {content.length}/500
        </Text>

        {/* Image Preview or Upload Button */}
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
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
              <X size={20} color={THEME.text} />
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            variant="outline"
            onPress={pickImage}
            disabled={uploading}
            fullWidth
          >
            <View style={styles.uploadButtonContent}>
              <Upload size={20} color={THEME.text} />
              <Text style={styles.uploadButtonText}>Add Photo</Text>
            </View>
          </Button>
        )}

        {/* Create Button */}
        <Button
          variant="primary"
          onPress={handleCreatePost}
          disabled={creating || uploading || !content.trim()}
          loading={creating}
          fullWidth
        >
          Share Post
        </Button>

        {/* Info Text */}
        <Text style={styles.infoText}>
          Your post will be visible to all Framez users
        </Text>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 120, // Space for tab bar
  },
  textInput: {
    backgroundColor: THEME.surface,
    color: THEME.text,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: THEME.textSecondary,
    fontSize: 12,
    textAlign: 'right',
    marginTop: -8,
  },
  imageContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 400,
    borderRadius: 24,
    backgroundColor: THEME.surfaceLight,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: THEME.text,
    fontSize: 16,
    marginTop: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
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
});