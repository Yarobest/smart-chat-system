import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { getInitials } from "@/src/utils/getInitials";

type TypingUser = { id: string; name: string };

export default function DirectMessageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
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

  const otherUser = useMemo(
    () => messages.find((message) => message.senderId !== user?.id)?.sender,
    [messages, user?.id],
  );
  const title = otherUser?.name ?? "Direct Chat";
  const initials = getInitials(title) || "DM";

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
            className="mr-3 h-8 w-8 items-center justify-center rounded-full"
          >
            <Text className="text-lg text-white">
              <Ionicons name="chevron-back" size={20} color="white" />
            </Text>
          </Pressable>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-[#C6F2D1]">
            <Text className="text-lg font-bold text-[#14532D]">{initials}</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-lg font-bold text-white">{title}</Text>
            <Text className="text-sm text-[#9FD0C5]">
              {typingUsers[0]?.name
                ? `${typingUsers[0].name} typing...`
                : otherUser?.role ?? "direct"}
            </Text>
          </View>
          <Pressable className="mr-3 h-8 w-8 items-center justify-center rounded-full">
            <Text className="text-lg text-pink-400">
              <Ionicons name="call" size={20} color="white" />
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
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-lg font-extrabold text-slate-500">
              NO MESSAGES YET
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end",
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="mb-4 self-center rounded-full bg-[#DDE3EF] px-4 py-1.5">
              <Text className="text-sm text-[#8B97B1]">Today, January 15</Text>
            </View>

            {messages.map((message) => {
              const mine = message.senderId === user?.id;
              return (
              <View
                key={message.id}
                className={`mb-3 ${mine ? "items-end" : "items-start"}`}
              >
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
        )}

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
            placeholder="Type a message..."
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
