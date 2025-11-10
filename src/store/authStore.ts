import { useState, useEffect, useMemo } from "react";
import { Platform } from "react-native";
import { User } from "../types/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "framez_user";

export const useAuthStore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (Platform.OS === "web") {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) setUser(JSON.parse(stored));
        } else {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Error loading user", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      }

    } catch (err) {
      console.error("Error saving user", err);
    }
  };

  const logout = async () => {
    setUser(null);

    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }

    } catch (err) {
      console.error("Error removing user", err);
    }
  };
  
  const isAuthenticated = useMemo(() => !!user, [user]);

  return { user, isAuthenticated, login, logout, loading };
};
