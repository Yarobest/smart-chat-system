import React, { useCallback } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "@/src/components/common/StatusBar";

export default function GroupChatScreen() {
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

  const groupMessages = [
    {
      id: "1",
      author: "Mr. Agordzo 👨‍🏫",
      text: "Good morning class! Please note that Assignment 3 is due this Friday at 5PM. No extensions will be given.",
      time: "8:00 AM",
      mine: false,
    },
    {
      id: "2",
      author: "Rudolf",
      text: "Can someone explain the difference between AVL trees and Red-Black trees?",
      time: "10:00 AM",
      mine: false,
    },
    {
      id: "3",
      text: "AVL trees are more strictly balanced so lookups are faster. Red-Black trees have faster insertions and deletions.",
      time: "10:01 AM",
      mine: true,
    },
    {
      id: "4",
      author: "Rudolf",
      text: "Thanks Stephen! That makes sense 👍",
      time: "10:02 AM",
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
            className="mr-3 h-9 w-9 items-center justify-center rounded-full"
          >
            <Ionicons name="chevron-back" size={20} color="white" />
          </Pressable>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-[#DCE9F8]">
            <Text className="text-lg">📚</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-xl font-extrabold leading-6 text-white">
              CS301 · Data Structures
            </Text>
            <Text className="text-sm text-white/70">32 members · 8 online</Text>
          </View>
          <Pressable className="mr-2 h-8 w-8 items-center justify-center rounded-full">
            <Text className="text-lg text-white">
              <Ionicons name="search" size={20} color="white" />
            </Text>
          </Pressable>
          <Pressable className="h-8 w-8 items-center justify-center rounded-full">
            <Text className="text-lg text-white">
              <Ionicons name="ellipsis-vertical" size={20} color="white" />
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-1 bg-[#F2F4F8]">
        <View className="border-b border-slate-200 bg-[#F7FAFF] px-4 py-3">
          <Text className="text-sm font-semibold text-[#2E63DF]">
            📌 Assignment 3 due Friday 5PM - submit via portal
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}
        >
          {groupMessages.map((message) => (
            <View
              key={message.id}
              className={`mb-3 ${message.mine ? "items-end" : "items-start"}`}
            >
              {!message.mine && message.author ? (
                <Text className="mb-1 text-sm font-semibold text-[#2E63DF]">
                  {message.author}
                </Text>
              ) : null}
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
            placeholder="Message CS301..."
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
