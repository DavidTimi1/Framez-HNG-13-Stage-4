import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ChevronLeftIcon, X } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THEME } from '@/lib/theme';
import { ProfileContent } from '@/components/ProfileContent';

export const UserProfileModal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, userName } = route.params as { userId: string; userName?: string };
  const BackIcon = Platform.OS === 'ios' ? ChevronLeftIcon : ArrowLeftIcon;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <BackIcon size={24} color={THEME.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}> {userName}'s Profile </Text>
        
        <View style={{ width: 24 }} />
      </View>

      <ProfileContent userId={userId} />
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
    paddingVertical: 12,
    borderBottomColor: THEME.surfaceLight,
    borderBottomWidth: 1,
  },
  closeButton: {
    backgroundColor: THEME.surfaceLight,
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    color: THEME.text,
    fontSize: 20,
    fontFamily: 'PoppinsBold',
  },
});
