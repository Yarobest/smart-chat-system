import { useCallback } from "react";
import {
  BackHandler,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "@/src/components/common/StatusBar";

export default function DirectMessageScreen() {
  const handleBack = () => {
    router.replace("/(student)/chats");
  };

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        handleBack();
        return true;
      });

      return () => sub.remove();
    }, [])
  );

  const messages = [
    {
      id: "1",
      text: "Good morning Stephen! I've reviewed your chapter one draft.",
      time: "9:01 AM",
      mine: false,
    },
    {
      id: "2",
      text: "Your background of the project section is very well written. I just need you to expand the limitations section a bit more.",
      time: "9:02 AM",
      mine: false,
    },
    {
      id: "3",
      text: "Thank you ma'am! I'll add more points to the limitations section and send it again.",
      time: "9:05 AM",
      mine: true,
    },
    {
      id: "4",
      text: "Your project report looks great overall! Keep it up 👏",
      time: "9:06 AM",
      mine: false,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />

      <View className="bg-[#051839] px-4 pb-4 pt-4">
        <View className="flex-row items-center">
          <Pressable
            onPress={handleBack}
            className="mr-3 h-8 w-8 items-center justify-center rounded-full"
          >
            <Text className="text-lg text-white">‹</Text>
          </Pressable>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-[#C6F2D1]">
            <Text className="text-lg">🧑‍🏫</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-lg font-bold text-white">Dr. Ama Mensah</Text>
            <Text className="text-sm text-[#9FD0C5]">● Online · Lecturer</Text>
          </View>
          <Pressable className="mr-3 h-8 w-8 items-center justify-center rounded-full">
            <Text className="text-lg text-pink-400">📞</Text>
          </Pressable>
          <Pressable className="h-8 w-8 items-center justify-center rounded-full">
            <Text className="text-lg text-white">⋮</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-1 bg-[#F2F4F8]">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
        >
          <View className="mb-4 self-center rounded-full bg-[#DDE3EF] px-4 py-1.5">
            <Text className="text-sm text-[#8B97B1]">Today, January 15</Text>
          </View>

          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-3 ${message.mine ? "items-end" : "items-start"}`}
            >
              <View
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.mine ? "bg-[#2E63DF]" : "bg-white"}`}
              >
                <Text
                  className={`text-lg leading-7 ${message.mine ? "text-white" : "text-[#1E293B]"}`}
                >
                  {message.text}
                </Text>
              </View>
              <Text className="mt-1 text-sm text-[#94A3B8]">
                {message.time}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View className="flex-row items-center border-t border-slate-200 bg-white px-3 py-3">
          <Pressable className="mr-2 h-8 w-8 items-center justify-center rounded-full">
            <Text className="text-lg text-slate-500">📎</Text>
          </Pressable>
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            className="flex-1 rounded-full border border-slate-200 bg-[#E9EEF6] px-4 py-2 text-lg text-slate-700"
          />
          <Pressable className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-[#2E63DF]">
            <Text className="text-lg text-white">➤</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
