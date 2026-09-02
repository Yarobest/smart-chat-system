import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminBottomNav } from "@/src/components/common/AdminBottomNav";
import { AdminPageHeader } from "@/src/components/common/AdminPageHeader";
import { PageLoader } from "@/src/components/common/PageLoader";
import { StatusBar } from "@/src/components/common/StatusBar";
import {
  AdminCourseOffering,
  adminService,
} from "@/src/services/admin.service";

export default function CourseAssignmentsScreen() {
  const [offerings, setOfferings] = useState<AdminCourseOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    const offeringData = await adminService.offerings();
    setOfferings(offeringData.offerings);
  };

  useEffect(() => {
    load()
      .catch((error) =>
        Alert.alert(
          "Courses failed",
          error instanceof Error ? error.message : "Unable to load courses",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const deleteOffering = (offering: AdminCourseOffering) => {
    Alert.alert(
      "Delete assignment?",
      `${offering.course.code} will be removed from this class. Linked group chats, assignments, quizzes, materials, and announcements for this assignment will also be removed.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(offering.id);
            try {
              await adminService.deleteOffering(offering.id);
              setOfferings((current) =>
                current.filter((item) => item.id !== offering.id),
              );
            } catch (error) {
              Alert.alert(
                "Delete failed",
                error instanceof Error
                  ? error.message
                  : "Unable to delete this course assignment",
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  };

  const renderDeleteAction = (offering: AdminCourseOffering) => (
    <Pressable
      onPress={() => deleteOffering(offering)}
      disabled={deletingId === offering.id}
      className="mb-3 ml-3 w-20 items-center justify-center rounded-2xl bg-red-500 active:bg-red-600"
    >
      <Ionicons name="trash-outline" size={24} color="white" />
      <Text className="mt-1 text-xs font-extrabold text-white">
        {deletingId === offering.id ? "..." : "Delete"}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#051839]" edges={["top"]}>
      <StatusBar style="light" backgroundColor="#051839" />
      <View className="flex-1 bg-[#F3F6FD]">
        <AdminPageHeader
          title="Courses"
          subtitle="Create courses and assign them to academic groups"
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        >
          <View className="mb-5 flex-row justify-between">
            <Pressable
              onPress={() => router.push("/(admin)/courses/create" as never)}
              className="w-[48.5%] rounded-2xl border border-blue-200 bg-white p-4 active:bg-blue-50"
            >
              <Ionicons name="book-outline" size={23} color="#2563EB" />
              <Text className="mt-3 text-base font-extrabold text-slate-900">
                Create Course
              </Text>
              <Text className="mt-1 text-xs leading-4 text-slate-500">
                Add a course to the catalogue
              </Text>
              <View className="mt-4 self-start rounded-lg bg-blue-600 px-3 py-2">
                <Text className="text-sm font-bold text-white">+ Create</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => router.push("/(admin)/courses/assign" as never)}
              className="w-[48.5%] rounded-2xl border border-emerald-200 bg-white p-4 active:bg-emerald-50"
            >
              <Ionicons name="link-outline" size={23} color="#059669" />
              <Text className="mt-3 text-base font-extrabold text-slate-900">
                Assign Course
              </Text>
              <Text className="mt-1 text-xs leading-4 text-slate-500">
                Connect lecturer and class
              </Text>
              <View className="mt-4 self-start rounded-lg bg-emerald-600 px-3 py-2">
                <Text className="text-sm font-bold text-white">Assign</Text>
              </View>
            </Pressable>
          </View>

          <Text className="mb-3 text-base font-extrabold text-slate-900">
            Active Courses Assign
          </Text>
          {offerings.map((offering) => (
            <Swipeable
              key={offering.id}
              renderRightActions={() => renderDeleteAction(offering)}
              overshootRight={false}
            >
              <Pressable
                onPress={() =>
                  router.push(`/(admin)/courses/${offering.id}` as never)
                }
                className="mb-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200 active:bg-slate-50"
              >
                <View className="flex-row justify-between">
                  <View className="flex-1 pr-3">
                    <Text
                      className="text-base font-extrabold text-slate-900"
                      numberOfLines={2}
                    >
                      {offering.course.code} · {offering.course.name}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-500">
                      {offering.academicYear} · {offering.semester}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-500">
                      {offering.lecturer.name} · {offering.group.memberCount}{" "}
                      members
                    </Text>
                  </View>
                  <View className="self-start rounded-lg bg-emerald-50 px-3 py-1">
                    <Text className="text-xs font-extrabold text-emerald-600">
                      {offering.status}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Swipeable>
          ))}
          {loading ? (
            <PageLoader label="Loading course assignments..." />
          ) : null}
          {!loading && !offerings.length ? (
            <Text className="text-center text-sm font-semibold text-slate-400">
              No course assignments yet.
            </Text>
          ) : null}
        </ScrollView>

        <AdminBottomNav active="courses" />
      </View>
    </SafeAreaView>
  );
}
