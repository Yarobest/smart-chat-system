import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function IndexPage() {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(-24)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translateX, {
        toValue: 52,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );

    const timeout = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 5000);

    loop.start();

    return () => {
      clearTimeout(timeout);
      loop.stop();
    };
  }, [router, translateX]);

  return (
    <LinearGradient
      colors={["#0A1628", "#1A3A6B", "#2563EB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/5" />
        <View className="absolute -bottom-10 -left-10 h-[200px] w-[200px] rounded-full bg-amber-400/20" />

        <View className="flex-1 items-center justify-center px-8">
          <View className="h-[90px] w-[90px] items-center justify-center rounded-3xl bg-white shadow-2xl">
            <Text className="text-4xl">🎓</Text>
          </View>

          <Text
            className="mt-6 text-center text-lg font-bold text-white"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            Campus Chat
          </Text>
          <Text className="mt-2 text-center text-lg text-white/70">
            Ho Technical University
          </Text>
          <Text className="text-center text-lg text-white/70">
            Academic Communication System
          </Text>

          <View className="mt-10 h-1 w-12 overflow-hidden rounded-full bg-white/20">
            <Animated.View
              style={{ transform: [{ translateX }] }}
              className="h-1 w-6 rounded-full bg-amber-400"
            />
          </View>
        </View>

        <Text className="pb-8 text-center text-lg text-white/50">
          Version 1.0 · HTU © 2026
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}
