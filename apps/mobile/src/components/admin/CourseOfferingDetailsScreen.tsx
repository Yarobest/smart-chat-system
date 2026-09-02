import { ComponentProps, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageLoader } from "@/src/components/common/PageLoader";
import { ScreenHeader } from "@/src/components/common/ScreenHeader";
import { StatusBar } from "@/src/components/common/StatusBar";
import {
  AdminCourseOfferingDetails,
  adminService,
} from "@/src/services/admin.service";
import { getInitials } from "@/src/utils/getInitials";
import { goBackOrReplace } from "@/src/utils/navigation";

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-2xl bg-white px-4 py-4 shadow-sm shadow-slate-200">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
        <Ionicons name={icon} size={20} color="#2563EB" />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-bold uppercase text-slate-400">
          {label}
        </Text>
        <Text className="mt-1 text-sm font-extrabold text-slate-900">
          {value}
        </Text>
      </View>
    </View>
  );
}

function PersonRow({
  name,
  subtitle,
  badge,
}: {
  name: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-2xl bg-white px-4 py-4 shadow-sm shadow-slate-200">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-[#3B6AE3]">
        <Text className="text-sm font-extrabold text-white">
          {getInitials(name)}
        </Text>
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-base font-extrabold text-slate-900" numberOfLines={1}>
          {name}
        </Text>
        <Text className="mt-1 text-sm text-slate-500" numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      {badge ? (
        <View className="ml-3 rounded-full bg-emerald-50 px-3 py-1">
          <Text className="text-xs font-extrabold text-emerald-600">
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default function CourseOfferingDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [details, setDetails] = useState<AdminCourseOfferingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Missing course assignment id");
      return;
    }

    let mounted = true;

    adminService
      .offering(id)
      .then((data) => {
        if (mounted) {
          setDetails(data.offering);
          setError("");
        }
      })
      .catch((caught) => {
        if (mounted) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load course assignment",
          );
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (!details) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
        <StatusBar style="light" backgroundColor="#0A1628" />
        <ScreenHeader title="Course Details" fallbackRoute="/(admin)/courses" />
        <View className="flex-1 items-center justify-center bg-[#F3F6FD] px-6">
          {loading ? (
            <PageLoader label="Loading course details..." />
          ) : (
            <Text className="text-center text-base font-semibold text-slate-700">
              {error || "Course assignment not found"}
            </Text>
          )}
          {!loading ? (
            <Pressable
              onPress={() => goBackOrReplace("/(admin)/courses")}
              className="mt-4 rounded-lg bg-[#3D6EE8] px-5 py-3"
            >
              <Text className="text-sm font-bold text-white">Go Back</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <StatusBar style="light" backgroundColor="#0A1628" />
      <View className="flex-1 bg-[#F3F6FD]">
        <ScreenHeader title="Course Details" fallbackRoute="/(admin)/courses" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-2xl bg-[#051839] px-4 py-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-bold uppercase text-white/50">
                  {details.status}
                </Text>
                <Text className="mt-2 text-2xl font-extrabold text-white" numberOfLines={2}>
                  {details.course.code}
                </Text>
                <Text className="mt-1 text-base font-semibold text-white/80" numberOfLines={2}>
                  {details.course.name}
                </Text>
              </View>
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Ionicons name="book-outline" size={28} color="white" />
              </View>
            </View>
          </View>

          <View className="mt-4">
            <InfoPill
              icon="calendar-outline"
              label="Session"
              value={`${details.academicYear} · ${details.semester}`}
            />
            <InfoPill
              icon="school-outline"
              label="Class"
              value={[
                details.course.programme,
                details.course.awardType,
                details.course.yearGroup,
              ]
                .filter(Boolean)
                .join(" · ") || "Not specified"}
            />
            <InfoPill
              icon="people-outline"
              label="Students"
              value={`${details.group.studentsCount} enrolled`}
            />
          </View>

          <Text className="mb-3 mt-3 text-base font-extrabold text-slate-900">
            Lecturer
          </Text>
          <PersonRow
            name={details.lecturer.name}
            subtitle={details.lecturer.email}
            badge="Lecturer"
          />

          <Text className="mb-3 mt-3 text-base font-extrabold text-slate-900">
            Students
          </Text>
          {details.students.map((student) => (
            <PersonRow
              key={student.id}
              name={student.name}
              subtitle={`${student.studentId ?? student.email} · ${student.department ?? "No department"}`}
            />
          ))}
          {!details.students.length ? (
            <View className="items-center rounded-2xl bg-white px-5 py-8">
              <Ionicons name="people-outline" size={34} color="#94A3B8" />
              <Text className="mt-3 text-center text-sm font-bold text-slate-500">
                No students are enrolled in this course assignment yet.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
