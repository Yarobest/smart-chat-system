import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { ChatTopBar } from "@/src/components/common/ChatTopBar";
import { FilterRow } from "@/src/components/common/FilterRow";
import { chatService } from "@/src/services/chat.service";
import { useAuth } from "@/src/hooks/useAuth";
import { ChatAttachment, Message } from "@/src/types/chat.types";
import { formatTime } from "@/src/utils/formatTime";
import { setReturnPath } from "@/src/stores/navigationStore";
import { assignmentService } from "@/src/services/assignment.service";
import { Assignment } from "@/src/types/assignment.types";

type TypingUser = { id: string; name: string };

const studentActions = {
  "Take Home": "/(student)/tasks/takehome",
  Quiz: "/(student)/tasks/quiz",
  Assignment: "/(student)/tasks/assignments",
  "Mid Sem": "/(student)/tasks/midsem",
  Notes: "/(student)/tasks/notes",
} as const;

const lecturerActions = {
  "Create Assignment": "/(lecturer)/courses/create-assignment",
  "Create Quiz": "/(lecturer)/courses/set-quiz",
  "Post Note": "/(lecturer)/courses/push-note",
  "Upload Slides": "/(lecturer)/courses/upload-notes",
  Submissions: "/(lecturer)/courses/submissions",
} as const;

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const isLecturer = user?.role === "lecturer";
  const [title, setTitle] = useState("Course Group");
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<Assignment[]>([]);
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
    if (!id) return;

    chatService
      .listThreads()
      .then((threads) => {
        const conversation = threads.find((thread) => thread.id === id);
        if (conversation) setTitle(conversation.title);
      })
      .catch(() => undefined);
  }, [id]);

  const loadAssignments = useCallback(() => {
    if (!id || isLecturer) {
      setPendingAssignments([]);
      return;
    }
    assignmentService
      .list()
      .then((items) => setPendingAssignments(
        items.filter((item) => item.course.conversationId === id && !item.submission),
      ))
      .catch(() => setPendingAssignments([]));
  }, [id, isLecturer]);

  useFocusEffect(useCallback(() => {
    loadAssignments();
    const interval = setInterval(loadAssignments, 10000);
    return () => clearInterval(interval);
  }, [loadAssignments]));

  const dismissAssignmentNotice = async () => {
    const dismissed = pendingAssignments.filter((item) => !item.alertDismissed);
    setPendingAssignments((current) => current.map((item) => ({ ...item, alertDismissed: true })));
    await Promise.all(dismissed.map((item) => assignmentService.dismissAlert(item.id))).catch(() => {
      loadAssignments();
      Alert.alert('Could not dismiss alert', 'Please try again.');
    });
  };

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

  const visibleMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return messages;

    return messages.filter(
      (message) =>
        message.text.toLowerCase().includes(query) ||
        message.attachments?.some((attachment) =>
          attachment.name.toLowerCase().includes(query),
        ),
    );
  }, [messages, search]);

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />

      <ChatTopBar
        title={title}
        subtitle={typingUsers[0]?.name ? `${typingUsers[0].name} typing...` : "Live conversation"}
        onBack={handleBack}
        onSearch={() => setSearchOpen((current) => !current)}
        avatar={(
          <View className="h-12 w-12 items-center justify-center rounded-full bg-[#DCE9F8]">
            <Text className="text-lg">📚</Text>
          </View>
        )}
      />

      {searchOpen ? (
        <View className="flex-row items-center bg-[#051839] px-4 pb-3">
          <View className="flex-1 flex-row items-center rounded-xl bg-white/10 px-3 py-2">
            <Ionicons name="search" size={17} color="#CBD5E1" />
            <TextInput
              autoFocus
              value={search}
              onChangeText={setSearch}
              placeholder="Search messages..."
              placeholderTextColor="#94A3B8"
              className="ml-2 flex-1 text-sm text-white"
            />
            {search.length > 0 ? (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#CBD5E1" />
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : null}

      <KeyboardAvoidingView
        className="flex-1 bg-[#F2F4F8]"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 24}
      >
        <FilterRow<string>
          filters={Object.keys(isLecturer ? lecturerActions : studentActions)}
          filled
          counts={!isLecturer ? { Assignment: pendingAssignments.length } : undefined}
          onSelect={(filter) => {
            const returnPath = isLecturer
              ? `/(lecturer)/groups/${id}`
              : `/(student)/chats/group/${id}`;
            const routes = isLecturer
              ? (lecturerActions as Record<string, string>)
              : (studentActions as Record<string, string>);

            setReturnPath(returnPath);
            router.push(routes[filter] as any);
          }}
        />

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
          {pendingAssignments.some((item) => !item.alertDismissed) ? (
            <View className="mb-3 flex-row items-center rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
              <Ionicons name="alert-circle" size={20} color="#D97706" />
              <Pressable
                className="ml-3 flex-1"
                onPress={() => router.push('/(student)/tasks/assignments' as any)}
              >
                <Text className="font-bold text-amber-900">New assignment{pendingAssignments.filter((item) => !item.alertDismissed).length > 1 ? 's' : ''}</Text>
                <Text className="text-sm text-amber-700">You have {pendingAssignments.filter((item) => !item.alertDismissed).length} pending in this course.</Text>
              </Pressable>
              <Pressable onPress={() => void dismissAssignmentNotice()}>
                <Ionicons name="close" size={20} color="#D97706" />
              </Pressable>
            </View>
          ) : null}
          {search.trim() && visibleMessages.length === 0 ? (
            <View className="mb-4 items-center rounded-xl bg-white px-4 py-5">
              <Text className="text-sm font-semibold text-slate-500">
                No messages match “{search.trim()}”
              </Text>
            </View>
          ) : null}
          {visibleMessages.map((message) => {
            const mine = message.isMine ?? message.senderId === user?.id;
            return (
            <View
              key={message.id}
              className={`mb-3 ${mine ? "items-end" : "items-start"}`}
            >
              {!mine ? (
                <Text className="mb-1 text-sm font-semibold text-[#2E63DF]">
                  Anonymous
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
