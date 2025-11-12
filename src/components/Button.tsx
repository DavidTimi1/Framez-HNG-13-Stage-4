import { Text, TouchableOpacity, Animated, View } from "react-native";
import { THEME } from "../lib/theme";
import { Loader2Icon } from "lucide-react-native";
import { useInfiniteRotation } from "@/hooks/use-infinite-animation";

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline';
    onPress: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    onPress,
    children,
    disabled = false,
    loading = false,
    fullWidth = false
}) => {
    const animatedStyle = useInfiniteRotation(1000);

    const getButtonStyle: any = () => {
        const baseStyle = {
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            width: fullWidth ? '100%' : 'auto',
            opacity: disabled ? 0.5 : 1,
        };

        switch (variant) {
            case 'primary':
                return { ...baseStyle, backgroundColor: THEME.primary };
            case 'secondary':
                return { ...baseStyle, backgroundColor: THEME.secondary };
            case 'outline':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: THEME.border
                };
            default:
                return baseStyle;
        }
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            <Text style={{
                color: THEME.text,
                fontSize: 16,
                fontWeight: '600',
                opacity: loading ? 0 : 1,
            }}>
                {children}
            </Text>
            {
                loading && (
                    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                        <Animated.View style={animatedStyle}>
                            <Loader2Icon size={20} color={THEME.text} style={{ margin: 'auto' }} />
                        </Animated.View>
                    </View>
                )
            }
        </TouchableOpacity>
    );
};