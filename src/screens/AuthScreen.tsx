import React, { useState } from 'react';
import {
    Animated,
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { CameraIcon, EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../components/Button';
import { THEME } from '../lib/theme';
import { useAuthStore } from '../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScreenTransition } from '@/hooks/use-screen-transitions';

export const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [ error, setError ] = useState('');

    const { login } = useAuthStore();
    const loginAction = useAction(api.authActions.login);
    const registerAction = useAction(api.authActions.register);
    const { animatedStyle } = useScreenTransition();

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Logo and Title */}
                <Animated.View style={[styles.header, animatedStyle]}>
                    <CameraIcon size={64} color={THEME.primary} />
                    <Text style={styles.title}>Framez</Text>
                    <Text style={styles.subtitle}>Share your moments</Text>
                </Animated.View>

                {/* Form */}
                <Animated.View style={[styles.form, animatedStyle]}>
                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

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

                    <View style={{ position: 'relative' }}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={THEME.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            style={styles.input}
                        />

                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.passwordToggle}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >

                            {showPassword ? (
                                <EyeOffIcon size={20} color={THEME.textSecondary} />
                            ) : (
                                <EyeIcon size={20} color={THEME.textSecondary} />
                            )}
                        </TouchableOpacity>
                    </View>

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
                </Animated.View>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );

    async function handleAuth(){
        // Clear any previous error
        setError('');

        if (!email || !password || (!isLogin && !name)) {
            setError('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                const result = await loginAction({ email, password });
                login({
                    _id: result.userId,
                    name: result.name,
                    email: result.email,
                    avatar: result.avatar,
                });
                Alert.alert('Success', 'Logged in successfully!');
            } else {
                const result = await registerAction({ email, name, password });
                login({
                    _id: result.userId,
                    name: result.name,
                    email: result.email,
                });
                Alert.alert('Success', 'Account created successfully!');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
            
        } finally {
            setLoading(false);
        }
    }
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
    passwordToggle: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: '-50%' }],
    },
    // 🔴 Error styles
    errorBox: {
        backgroundColor: '#FEE2E2',
        borderColor: '#FCA5A5',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
    errorText: {
        color: '#B91C1C',
        fontSize: 14,
        textAlign: 'center',
    },
});