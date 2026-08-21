import { Component, type ReactNode } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, LogBox, Pressable, Text, View } from 'react-native';
import '../global.css';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

LogBox.ignoreLogs([
  "SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead.",
]);

type GlobalErrorUtils = {
  getGlobalHandler?: () => (error: Error, isFatal?: boolean) => void;
  setGlobalHandler?: (handler: (error: Error, isFatal?: boolean) => void) => void;
};

const errorUtils = (globalThis as typeof globalThis & { ErrorUtils?: GlobalErrorUtils }).ErrorUtils;
const defaultGlobalErrorHandler = errorUtils?.getGlobalHandler?.();

errorUtils?.setGlobalHandler?.((error, isFatal) => {
  if (isFatal) {
    Alert.alert('SMART CHAT error', error.message || 'The app could not finish opening.');
  }

  defaultGlobalErrorHandler?.(error, isFatal);
});

export const unstable_settings = {
  initialRouteName: 'index',
};

type RootErrorBoundaryState = {
  error: Error | null;
};

class RootErrorBoundary extends Component<{ children: ReactNode }, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View className="flex-1 items-center justify-center bg-[#0A1628] px-6">
          <Text className="text-center text-2xl font-bold text-white">SMART CHAT</Text>
          <Text className="mt-4 text-center text-base text-white/70">
            Something went wrong while opening the app.
          </Text>
          <Text className="mt-3 text-center text-sm text-white/50">
            {this.state.error.message}
          </Text>
          <Pressable
            className="mt-8 rounded-lg bg-[#38BDF8] px-5 py-3"
            onPress={() => this.setState({ error: null })}
          >
            <Text className="font-bold text-[#051839]">Try again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <RootErrorBoundary>
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
    </RootErrorBoundary>
  );
}
