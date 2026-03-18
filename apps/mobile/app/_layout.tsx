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
if (!Text.defaultProps) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.maxFontSizeMultiplier = 1;

if (!TextInput.defaultProps) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.maxFontSizeMultiplier = 1;

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
