import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { CameraIcon } from 'lucide-react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../components/Button';
import { THEME } from '../lib/theme';
import { useAuthStore } from '../store/authStore';

export const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuthStore();
    const loginMutation = useMutation(api.auth.login);
    const registerMutation = useMutation(api.auth.register);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleAuth = async () => {
        // Validation
        if (!email || !password || (!isLogin && !name)) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                const result = await loginMutation({ email, password });
                login({
                    _id: result.userId,
                    name: result.name,
                    email: result.email,
                    avatar: result.avatar
                });
                Alert.alert('Success', 'Logged in successfully!');

            } else {
                const result = await registerMutation({ email, name, password });
                login({
                    _id: result.userId,
                    name: result.name,
                    email: result.email
                });

                Alert.alert('Success', 'Account created successfully!');
            }
        } catch (error: any) {
            Alert.alert(
                'Error',
                error.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Logo and Title */}
                <View style={styles.header}>
                    <CameraIcon size={64} color={THEME.primary} />
                    <Text style={styles.title}>Framez</Text>
                    <Text style={styles.subtitle}>Share your moments</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {!isLogin && (
                        <TextInput
                            placeholder="Full Name"
                            placeholderTextColor={THEME.textSecondary}
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            autoCapitalize="words"
                        />
                    )}

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor={THEME.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={THEME.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        style={styles.input}
                    />

                    <Button
                        variant="primary"
                        onPress={handleAuth}
                        disabled={loading}
                        loading={loading}
                        fullWidth
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </Button>

                    <TouchableOpacity
                        onPress={() => {
                            setIsLogin(!isLogin);
                            setName('');
                            setEmail('');
                            setPassword('');
                        }}
                        style={styles.switchButton}
                    >
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <Text style={styles.switchTextBold}>
                                {isLogin ? 'Sign Up' : 'Login'}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        marginBottom: 48,
        alignItems: 'center',
    },
    title: {
        color: THEME.text,
        fontSize: 36,
        fontWeight: '700',
        marginTop: 16,
    },
    subtitle: {
        color: THEME.textSecondary,
        fontSize: 16,
        marginTop: 8,
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: THEME.surface,
        color: THEME.text,
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: THEME.border,
    },
    switchButton: {
        alignItems: 'center',
        marginTop: 8,
    },
    switchText: {
        color: THEME.textSecondary,
        fontSize: 14,
    },
    switchTextBold: {
        color: THEME.primary,
        fontWeight: '600',
    },
});