import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { Camera, Heart, MessageCircle, Send, UserIcon, HomeIcon, PlusSquareIcon, LogOut, Upload, X } from 'lucide-react-native';
import { THEME } from '../lib/theme';



interface NavbarProps {
    activeTab: 'home' | 'create' | 'profile';
    onTabChange: (tab: 'home' | 'create' | 'profile') => void;
  }
  
export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
    return (
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10,
      }}>
        <TouchableOpacity 
          onPress={() => onTabChange('home')}
          style={{ alignItems: 'center', padding: 10 }}
        >
          <HomeIcon 
            size={26} 
            color={activeTab === 'home' ? THEME.primary : THEME.textSecondary} 
          />
          <Text style={{ 
            color: activeTab === 'home' ? THEME.primary : THEME.textSecondary, 
            fontSize: 11,
            marginTop: 4,
            fontWeight: activeTab === 'home' ? '600' : '400'
          }}>
            Home
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity 
          onPress={() => onTabChange('create')}
          style={{ alignItems: 'center', padding: 10 }}
        >
          <PlusSquareIcon 
            size={26} 
            color={activeTab === 'create' ? THEME.primary : THEME.textSecondary} 
          />
          <Text style={{ 
            color: activeTab === 'create' ? THEME.primary : THEME.textSecondary, 
            fontSize: 11,
            marginTop: 4,
            fontWeight: activeTab === 'create' ? '600' : '400'
          }}>
            Create
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity 
          onPress={() => onTabChange('profile')}
          style={{ alignItems: 'center', padding: 10 }}
        >
          <UserIcon 
            size={26} 
            color={activeTab === 'profile' ? THEME.primary : THEME.textSecondary} 
          />
          <Text style={{ 
            color: activeTab === 'profile' ? THEME.primary : THEME.textSecondary, 
            fontSize: 11,
            marginTop: 4,
            fontWeight: activeTab === 'profile' ? '600' : '400'
          }}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    );
  };