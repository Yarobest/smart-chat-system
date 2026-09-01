import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "@/src/components/common/StatusBar";
import { ScreenHeader } from "@/src/components/common/ScreenHeader";
import { useLiveThreads } from "@/src/hooks/useLiveThreads";
import { User } from "@/src/types/auth.types";
import { Thread } from "@/src/types/chat.types";

function studentLine(student: User) {
  return [student.studentId, student.programme, student.yearGroup]
    .filter(Boolean)
    .join(" · ");
}

function groupTitle(thread: Thread) {
  return thread.courseName ?? thread.title;
}

function groupSubtitle(thread: Thread) {
  return [thread.courseCode, thread.programme, thread.yearGroup]
    .filter(Boolean)
    .join(" · ");
}

export default function LecturerGroupsScreen() {
  const { threads, loading } = useLiveThreads();
  const [search, setSearch] = useState("");

  const groups = useMemo(
    () =>
      threads
        .filter((thread) => thread.type === "group")
        .map((thread) => ({
          thread,
          students:
            thread.members
              ?.map((member) => member.user)
              .filter((user) => user.role === "student") ?? [],
        })),
    [threads],
  );

  const visibleGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groups;

    return groups
      .map((group) => ({
        ...group,
        students: group.students.filter((student) =>
          [
            student.name,
            student.email,
            student.studentId,
            student.programme,
            student.yearGroup,
          ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query)),
        ),
      }))
      .filter(
        (group) =>
          group.students.length > 0 ||
          [groupTitle(group.thread), groupSubtitle(group.thread)]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(query)),
      );
  }, [groups, search]);

  const totalStudents = useMemo(() => {
    const ids = new Set<string>();
    groups.forEach((group) => {
      group.students.forEach((student) => ids.add(student.id));
    });

    return ids.size;
  }, [groups]);

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="My Students" fallbackRoute="/(lecturer)/profile" />

      <View className="bg-[#051839] px-4 pb-4">
        <View className="rounded-2xl bg-white/10 px-4 py-3">
          <Text className="text-2xl font-extrabold text-white">{totalStudents}</Text>
          <Text className="text-sm font-semibold text-slate-300">
            Students across {groups.length} course group{groups.length === 1 ? "" : "s"}
          </Text>
        </View>
        <View className="mt-3 flex-row items-center rounded-2xl bg-white/10 px-4 py-2.5">
          <Ionicons name="search" size={16} color="#CBD5E1" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search students..."
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

      <ScrollView
        className="flex-1 bg-[#F5F7FA]"
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 28 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {loading ? <ActivityIndicator color="#2563EB" /> : null}

        {!loading && visibleGroups.length === 0 ? (
          <View className="items-center py-16">
            <Ionicons name="people-outline" size={42} color="#94A3B8" />
            <Text className="mt-3 text-base font-bold text-slate-500">
              No students found
            </Text>
          </View>
        ) : null}

        {visibleGroups.map(({ thread, students }) => (
          <View
            key={thread.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(lecturer)/groups/[id]",
                  params: { id: thread.id, from: "students" },
                } as any)
              }
              className="flex-row items-start justify-between border-b border-slate-100 px-4 py-4"
            >
              <View className="mr-3 flex-1">
                <Text className="text-base font-extrabold text-slate-900" numberOfLines={2}>
                  {groupTitle(thread)}
                </Text>
                <Text className="mt-1 text-xs font-semibold text-slate-400">
                  {groupSubtitle(thread) || "Course group"}
                </Text>
              </View>
              <View className="rounded-full bg-blue-50 px-3 py-1">
                <Text className="text-xs font-bold text-blue-700">
                  {students.length} student{students.length === 1 ? "" : "s"}
                </Text>
              </View>
            </Pressable>

            {students.map((student) => (
              <View key={`${thread.id}-${student.id}`} className="flex-row items-center px-4 py-3">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                  <Ionicons name="person-outline" size={18} color="#7C3AED" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>
                    {student.name}
                  </Text>
                  <Text className="mt-0.5 text-xs text-slate-500" numberOfLines={1}>
                    {studentLine(student) || student.email}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
