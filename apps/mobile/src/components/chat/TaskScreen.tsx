import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "@/src/components/common/StatusBar";

type TaskFilter = {
  id: string;
  label: string;
  route: string;
};

type TaskCard = {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  meta: string;
  description: string;
  ctaLabel: string;
  ctaRoute: string;
  accent: string;
  badge?: string;
};

export default function TaskScreen() {
  const [activeFilter, setActiveFilter] = useState("all");

  const handleBack = () => {
    router.back();
  };

  const filters: TaskFilter[] = [
    { id: "all", label: "All", route: "/(student)/tasks" },
    { id: "quizzes", label: "Quizzes", route: "/(student)/tasks/quizzes" },
    {
      id: "assignments",
      label: "Assignments",
      route: "/(student)/tasks/assignments",
    },
    { id: "notes", label: "Notes", route: "/(student)/tasks/notes" },
  ];

  const urgentCards: TaskCard[] = [
    {
      id: "cs301-mid-sem",
      section: "URGENT — CLOSING SOON",
      title: "CS301 Mid-Semester Quiz",
      subtitle: "CS301 Data Structures",
      meta: "15 questions · 45 min · Closes: Today 5:00 PM",
      description: "AVL Trees, Heaps, Graph Algorithms",
      ctaLabel: "Start Quiz Now →",
      ctaRoute: "/(student)/tasks/quizzes/cs301-mid-sem",
      accent: "#EF4444",
    },
  ];

  const activeCards: TaskCard[] = [
    {
      id: "cs205-network-assignment",
      section: "ACTIVE — OPEN NOW",
      title: "CS205 Network Assignment",
      subtitle: "CS205 · Computer Networks",
      meta: "Due: Fri Jan 7, 5PM",
      description: "Write a 500-word analysis on OSI vs TCP/IP layers with diagrams.",
      ctaLabel: "Open Assignment →",
      ctaRoute: "/(student)/tasks/assignments/cs205-network",
      accent: "#2563EB",
      badge: "New",
    },
    {
      id: "cs410-design-patterns-notes",
      section: "NEW NOTES",
      title: "CS410 Design Patterns Notes",
      subtitle: "CS410 · Software Engineering",
      meta: "Added: Jan 13",
      description: "Chapter 4 – Factory, Observer & Strategy patterns. 12 pages.",
      ctaLabel: "Read Notes →",
      ctaRoute: "/(student)/tasks/notes/cs410-design-patterns",
      accent: "#8B5CF6",
      badge: "New",
    },
  ];

  const completedCards: TaskCard[] = [
    {
      id: "cs301-week-3-quiz",
      section: "COMPLETED",
      title: "CS301 Week 3 Quiz",
      subtitle: "CS301 · Data Structures",
      meta: "Closed: Jan 10",
      description: "Quiz completed and submitted.",
      ctaLabel: "View My Result →",
      ctaRoute: "/(student)/tasks/quizzes",
      accent: "#10B981",
      badge: "Submitted",
    },
    {
      id: "cs102-html-assignment",
      section: "COMPLETED",
      title: "CS102 HTML & CSS Assignment",
      subtitle: "CS102 · Web Development",
      meta: "Submitted: Jan 6",
      description: "Build a responsive website homepage.",
      ctaLabel: "View Feedback →",
      ctaRoute: "/(student)/tasks/assignments",
      accent: "#18219a",
      badge: "Submitted",
    },
    {
      id: "cs401-sql-quiz",
      section: "COMPLETED",
      title: "CS401 SQL Basics Quiz",
      subtitle: "CS401 · Databases",
      meta: "Closed: Jan 3",
      description: "Quiz on SQL SELECT statements and JOINs.",
      ctaLabel: "View Result →",
      ctaRoute: "/(student)/tasks/quizzes",
      accent: "#325b22",
    },
  ];

  const renderTaskCard = (task: TaskCard) => (
    <View
      key={task.id}
      className="mb-4 overflow-hidden rounded-2xl bg-white p-4"
      style={{ borderLeftWidth: 4, borderLeftColor: task.accent }}
    >
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-xs font-bold tracking-wider text-slate-400">
          {task.section}
        </Text>
        {task.badge && (
          <View
            className="rounded-full px-2 py-1"
            style={{
              backgroundColor:
                task.badge === "Submitted"
                  ? "#DCFCE7"
                  : task.badge === "New"
                    ? "#EDE9FE"
                    : "#F0F9FF",
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{
                color:
                  task.badge === "Submitted"
                    ? "#15803D"
                    : task.badge === "New"
                      ? "#6D28D9"
                      : "#0369A1",
              }}
            >
              {task.badge === "Submitted" ? "✓ " : ""}
              {task.badge}
            </Text>
          </View>
        )}
      </View>
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-xl font-extrabold text-slate-900">{task.title}</Text>
          <Text className="text-base text-slate-500">{task.subtitle}</Text>
        </View>
        {task.section.includes("URGENT") && (
          <View className="ml-2 rounded-full bg-red-100 px-2 py-1">
            <Text className="text-xs font-bold text-red-600">🔴 Closing</Text>
          </View>
        )}
      </View>
      <Text className="mb-2 text-sm font-semibold text-[#2E63DF]">{task.meta}</Text>
      <Text className="mb-4 text-base text-slate-600">{task.description}</Text>
      <Pressable
        onPress={() => router.push(task.ctaRoute as any)}
        style={{ backgroundColor: task.accent }}
        className="rounded-xl px-4 py-3"
      >
        <Text className="text-center text-base font-bold text-white">
          {task.ctaLabel}
        </Text>
      </Pressable>
    </View>
  );

  const handleFilterPress = (filterId: string, route: string) => {
    setActiveFilter(filterId);
    router.push(route as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F2F4F8]">
      <StatusBar style="dark" backgroundColor="#F2F4F8" />
      
      <View className="border-b border-slate-700 bg-[#051839] px-4 py-9 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Pressable
            onPress={handleBack}
            className="mr-3 h-9 w-9 items-center justify-center rounded-full"
          >
            <Ionicons name="chevron-back" size={20} color="white" />
          </Pressable>
          <Text className="text-sm font-bold text-slate-400">
            Assignments, Quizzes & Notes
          </Text>
        </View>
        <Text className="text-2xl">
          📝
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ paddingRight: 8 }}
        >
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              onPress={() => handleFilterPress(filter.id, filter.route)}
              className={`mr-2 rounded-full px-4 py-2 ${
                activeFilter === filter.id ? "bg-[#2E63DF]" : "bg-[#E5E9F2]"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeFilter === filter.id ? "text-white" : "text-[#4A5568]"
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="mb-6 flex-row justify-between">
          <View className="w-[31%] rounded-2xl bg-white p-3">
            <Text className="text-center text-4xl font-black text-[#EF4444]">2</Text>
            <Text className="text-center text-sm text-slate-500">Due Today</Text>
          </View>
          <View className="w-[31%] rounded-2xl bg-white p-3">
            <Text className="text-center text-4xl font-black text-[#F59E0B]">3</Text>
            <Text className="text-center text-sm text-slate-500">This Week</Text>
          </View>
          <View className="w-[31%] rounded-2xl bg-white p-3">
            <Text className="text-center text-4xl font-black text-[#10B981]">5</Text>
            <Text className="text-center text-sm text-slate-500">Submitted</Text>
          </View>
        </View>

        {urgentCards.map(renderTaskCard)}
        {activeCards.map(renderTaskCard)}
        {completedCards.map(renderTaskCard)}
      </ScrollView>
    </SafeAreaView>
  );
}