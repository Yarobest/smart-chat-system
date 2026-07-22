import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "@/src/components/common/StatusBar";
import { ScreenHeader } from "@/src/components/common/ScreenHeader";
import { PageLoader } from "@/src/components/common/PageLoader";
import { AdminUserDetails, adminService } from "@/src/services/admin.service";
import { getInitials } from "@/src/utils/getInitials";
import { goBackOrReplace } from "@/src/utils/navigation";

function DetailRow({
  icon,
  label,
  value,
  valueAccent,
}: {
  icon: string;
  label: string;
  value: string;
  valueAccent?: string;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm shadow-slate-200">
      <View className="mr-3 flex-1 flex-row items-center">
        <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Text className="text-lg">{icon}</Text>
        </View>
        <Text
          className="flex-1 text-sm font-semibold text-slate-900"
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>

      <Text
        numberOfLines={2}
        className={`max-w-[52%] text-right text-sm font-semibold ${valueAccent ?? "text-slate-500"}`}
      >
        {value}
      </Text>
    </View>
  );
}

export default function UserDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Missing user id");
      return;
    }

    let mounted = true;

    adminService
      .user(id)
      .then((data) => {
        if (mounted) {
          setDetails(data);
          setError("");
        }
      })
      .catch((caught) => {
        if (mounted) {
          setError(
            caught instanceof Error ? caught.message : "Unable to load user",
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

  const user = details?.user;

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
        <StatusBar style="light" backgroundColor="#0A1628" />
        <ScreenHeader title="User Details" fallbackRoute="/(admin)/users" />
        <View className="flex-1 items-center justify-center bg-[#F3F6FD] px-6">
          {loading ? (
            <PageLoader label="Loading user..." />
          ) : (
            <Text className="text-base font-semibold text-slate-700">
              {error || "User not found"}
            </Text>
          )}
          <Pressable
            onPress={() => goBackOrReplace("/(admin)/users")}
            className="mt-4 rounded-lg bg-[#3D6EE8] px-5 py-3"
          >
            <Text className="text-sm font-bold text-white">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A1628]" edges={["top"]}>
      <StatusBar style="light" backgroundColor="#0A1628" />
      <View className="flex-1 bg-[#F3F6FD]">
        <ScreenHeader title="User Details" fallbackRoute="/(admin)/users" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 18 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pb-6 pt-4">
            <View className="rounded-2xl border border-blue-200 bg-white px-4 py-5 shadow-sm shadow-slate-200">
              <View className="flex-row items-center">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-[#3B6AE3]">
                  <Text className="text-2xl font-extrabold text-white">
                    {getInitials(user.name)}
                  </Text>
                </View>

                <View className="ml-4 flex-1">
                  <Text
                    className="text-xl font-extrabold text-slate-900"
                    numberOfLines={2}
                  >
                    {user.name}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-400">
                    ID: {user.studentId ?? user.staffId ?? user.id} ·{" "}
                    {user.department ?? "No department"}
                  </Text>

                  <View className="mt-3 flex-row items-center">
                    <View className="rounded-full bg-blue-50 px-3 py-1.5">
                      <Text className="text-sm font-extrabold text-blue-600">
                        {user.role.toUpperCase()}
                      </Text>
                    </View>

                    <View className="ml-3 flex-row items-center rounded-full bg-emerald-50 px-3 py-1.5">
                      <View
                        className={`mr-2 h-3 w-3 rounded-full ${user.isOnline ? "bg-lime-500" : "bg-slate-300"}`}
                      />
                      <Text className="text-sm font-bold text-emerald-600">
                        {user.isOnline ? "Online" : "Offline"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="mt-4 flex-row justify-between">
              {[
                {
                  label: "Chats",
                  value: String(details?.stats.conversations ?? 0),
                },
                { label: "Role", value: user.role.toUpperCase() },
                {
                  label: "Status",
                  value: user.isOnline ? "ONLINE" : "OFFLINE",
                },
              ].map((stat) => (
                <View
                  key={stat.label}
                  className="w-[31.5%] rounded-2xl bg-white px-3 py-4 shadow-sm shadow-slate-200"
                >
                  <Text
                    className="text-lg font-extrabold text-slate-900"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {stat.value}
                  </Text>
                  <Text className="mt-1 text-sm font-medium text-slate-400">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>

            <Text className="mb-3 mt-5 text-base font-extrabold text-slate-900">
              Account Info
            </Text>
            <DetailRow
              icon="📧"
              label="Email"
              value={user.email}
              valueAccent="text-blue-600"
            />
            <DetailRow
              icon="📅"
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
            <DetailRow
              icon="📱"
              label="Last Seen"
              value={
                user.lastSeenAt
                  ? new Date(user.lastSeenAt).toLocaleString()
                  : "Not available"
              }
            />
            <DetailRow
              icon="🔐"
              label="Faculty"
              value={user.faculty ?? "Not set"}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
