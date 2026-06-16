import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "@/src/components/common/StatusBar";
import { chatService } from "@/src/services/chat.service";
import { useAuth } from "@/src/hooks/useAuth";
import { ChatAttachment, Message } from "@/src/types/chat.types";
import { formatTime } from "@/src/utils/formatTime";
import { setReturnPath } from "@/src/stores/navigationStore";

type TypingUser = { id: string; name: string };

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [showTaskNotification, setShowTaskNotification] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const lastTypingAt = useRef(0);

  const handleBack = useCallback(() => {
    router.replace(user?.role === "lecturer" ? "/(lecturer)/chats" : "/(student)/chats");
  }, [user?.role]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        handleBack();
        return true;
      });

      return () => sub.remove();
    }, [handleBack])
  );

  const loadMessages = useCallback(() => {
    if (!id) return;

    chatService
      .listMessages(id)
      .then(setMessages)
      .catch((error) => {
        Alert.alert(
          "Could not load messages",
          error instanceof Error ? error.message : "Please try again.",
        );
      });
  }, [id]);

  useEffect(() => {
    loadMessages();

    if (!id) return;
    const interval = setInterval(loadMessages, 5000);

    return () => clearInterval(interval);
  }, [id, loadMessages]);

  useEffect(() => {
    if (!id) return;

    const loadTyping = () => {
      chatService
        .listTyping(id)
        .then((result) => setTypingUsers(result.users))
        .catch(() => setTypingUsers([]));
    };

    loadTyping();
    const interval = setInterval(loadTyping, 1500);

    return () => clearInterval(interval);
  }, [id]);

  const handleTextChange = (value: string) => {
    setText(value);
    if (!id || value.trim().length === 0) return;

    const now = Date.now();
    if (now - lastTypingAt.current < 1500) return;

    lastTypingAt.current = now;
    chatService.setTyping(id).catch(() => undefined);
  };

  const handleSend = async () => {
    const value = text.trim();
    if (!id || (!value && attachments.length === 0) || sending) return;

    try {
      setSending(true);
      const message = await chatService.sendMessage(id, value, attachments);
      setMessages((current) => [...current, message]);
      setText("");
      setAttachments([]);
    } catch (error) {
      Alert.alert(
        "Could not send message",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    setAttachments((current) => [
      ...current,
      {
        type: "file",
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        uri: file.uri,
      },
    ]);
  };

  const pickImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: "image/*",
    });

    if (result.canceled) return;

    const image = result.assets[0];
    setAttachments((current) => [
      ...current,
      {
        type: "image",
        name: image.name,
        mimeType: image.mimeType,
        size: image.size,
        uri: image.uri,
      },
    ]);
  };

  const openAttachmentPicker = () => {
    Alert.alert("Attach", "Choose what to send", [
      { text: "Image", onPress: pickImage },
      { text: "File", onPress: pickDocument },
      { text: "Cancel", style: "cancel" },
    ]);
  };

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
              Group Chat
            </Text>
            <Text className="text-sm text-white/70">
              {typingUsers[0]?.name
                ? `${typingUsers[0].name} typing...`
                : "Live conversation"}
            </Text>
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

      <KeyboardAvoidingView
        className="flex-1 bg-[#F2F4F8]"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 24}
      >
       <View className="border-b border-slate-200 bg-[#F7FAFF] px-3 py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            
            {[
              { label: "Take Home", route: "/(student)/tasks/takehome" },
              { label: "Quiz", route: "/(student)/tasks/quiz" },
              { label: "Assignment", route: "/(student)/tasks/assignment" },
              { label: "Mid Sem", route: "/(student)/tasks/midsem" },
              { label: "Notes", route: "/(student)/tasks/notes" },
            ].map((item, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  // Set the return path so user can navigate back to group chat
                  setReturnPath("/(student)/chats/group/cs301");
                  router.push(item.route as any);
                }}
                className="mr-3 rounded-full bg-[#2E63DF] px-4 py-2"
              >
                <Text className="text-sm font-semibold text-white">
                  {item.label}
                </Text>
              </Pressable>
            ))}

          </ScrollView>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {showTaskNotification && (
            <View className="mb-3 rounded-xl bg-[#FEF3C7] px-4 py-3 border border-[#FBBF24] flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#D97706" />
              <View className="flex-1 ml-3">
                <Text className="font-bold text-[#92400E]">New Tasks Assigned ✓</Text>
                <Text className="text-sm text-[#B45309]">You have 5 pending tasks. Complete them to dismiss this notification.</Text>
              </View>
              <Pressable onPress={() => setShowTaskNotification(false)}>
                <Ionicons name="close" size={20} color="#D97706" />
              </Pressable>
            </View>
          )}
          {messages.map((message) => {
            const mine = message.senderId === user?.id;
            return (
            <View
              key={message.id}
              className={`mb-3 ${mine ? "items-end" : "items-start"}`}
            >
              {!mine && message.sender?.name ? (
                <Text className="mb-1 text-sm font-semibold text-[#2E63DF]">
                  {message.sender.name}
                </Text>
              ) : null}
              <View
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${mine ? "bg-[#2E63DF]" : "bg-white"}`}
              >
                {message.text ? (
                  <Text
                    className={`text-lg leading-7 ${mine ? "text-white" : "text-[#1E293B]"}`}
                  >
                    {message.text}
                  </Text>
                ) : null}
                {message.attachments?.map((attachment) => (
                  <View key={`${message.id}-${attachment.name}`} className="mt-2 rounded-xl bg-black/10 px-3 py-2">
                    <Text className={`text-sm font-semibold ${mine ? "text-white" : "text-slate-700"}`}>
                      {attachment.type === "image" ? "🖼️" : "📎"} {attachment.name}
                    </Text>
                  </View>
                ))}
              </View>
              <Text className="mt-1 text-sm text-[#94A3B8]">
                {formatTime(message.createdAt)}
                {mine ? ` · ${message.seen ? "Seen" : "Sent"}` : ""}
              </Text>
            </View>
          )})}
        </ScrollView>

        <View className="border-t border-slate-200 bg-white px-3 py-3">
          {attachments.length > 0 ? (
            <View className="mb-2 flex-row flex-wrap">
              {attachments.map((attachment, index) => (
                <Pressable
                  key={`${attachment.name}-${index}`}
                  onPress={() =>
                    setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))
                  }
                  className="mb-2 mr-2 rounded-full bg-blue-50 px-3 py-1"
                >
                  <Text className="text-xs font-semibold text-blue-700">
                    {attachment.type === "image" ? "🖼️" : "📎"} {attachment.name} ×
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <View className="flex-row items-center">
          <Pressable
            onPress={openAttachmentPicker}
            className="mr-2 h-8 w-8 items-center justify-center rounded-full"
          >
            <Text className="text-lg text-slate-500">📎</Text>
          </Pressable>
          <TextInput
            value={text}
            onChangeText={handleTextChange}
            placeholder="Message group..."
            placeholderTextColor="#94A3B8"
            className="flex-1 rounded-full border border-slate-200 bg-[#E9EEF6] px-4 py-2 text-lg text-slate-700"
          />
          <Pressable
            onPress={handleSend}
            disabled={sending || (text.trim().length === 0 && attachments.length === 0)}
            className={`ml-2 h-10 w-10 items-center justify-center rounded-full ${sending || (text.trim().length === 0 && attachments.length === 0) ? "bg-slate-300" : "bg-[#2E63DF]"}`}
          >
            <Text className="text-lg text-white">➤</Text>
          </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
