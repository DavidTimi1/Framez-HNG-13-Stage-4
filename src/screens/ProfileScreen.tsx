import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LogOutIcon, Camera } from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import { THEME } from '../lib/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileContent } from '@/components/ProfileContent';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>

        {/* Floating Logout */}
        <TouchableOpacity style={styles.logoutButtonContainer} onPress={handleLogout}>
          <LogOutIcon size={24} color={THEME.primary} />
        </TouchableOpacity>
      </View>

      <ProfileContent userId={user?._id} />
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
  headerTitle: { color: THEME.text, fontSize: 24, fontFamily: 'PoppinsBold' },
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
});
