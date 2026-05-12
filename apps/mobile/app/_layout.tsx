import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox, Text, TextInput } from 'react-native';
import 'react-native-reanimated';
import '../global.css';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

LogBox.ignoreLogs([
  "SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead.",
]);

// Keep typography consistent across platforms by disabling dynamic type scaling.
const TextComponent = Text as typeof Text & {
  defaultProps?: {
    allowFontScaling?: boolean;
    maxFontSizeMultiplier?: number;
  };
};
const TextInputComponent = TextInput as typeof TextInput & {
  defaultProps?: {
    allowFontScaling?: boolean;
    maxFontSizeMultiplier?: number;
  };
};

if (!TextComponent.defaultProps) TextComponent.defaultProps = {};
TextComponent.defaultProps.allowFontScaling = false;
TextComponent.defaultProps.maxFontSizeMultiplier = 1;

if (!TextInputComponent.defaultProps) TextInputComponent.defaultProps = {};
TextInputComponent.defaultProps.allowFontScaling = false;
TextInputComponent.defaultProps.maxFontSizeMultiplier = 1;

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(student)" />
        <Stack.Screen name="(lecturer)" />
        <Stack.Screen name="(admin)" />
      </Stack>
      <StatusBar style="auto" hidden={false} />
    </ThemeProvider>
  );
}
