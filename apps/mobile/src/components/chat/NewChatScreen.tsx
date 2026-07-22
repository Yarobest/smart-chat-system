import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  AWARD_TYPES,
  AwardType,
  HTU_FACULTIES,
  YEAR_GROUPS,
  getDepartments,
  getProgrammes,
} from "@/src/constants/htuAcademics";
import { StatusBar } from "@/src/components/common/StatusBar";
import { ScreenHeader } from "@/src/components/common/ScreenHeader";
import { chatService } from "@/src/services/chat.service";
import { User } from "@/src/types/auth.types";
import { getInitials } from "@/src/utils/getInitials";
import { useAuth } from "@/src/hooks/useAuth";

type DropdownKey = "faculty" | "department" | "awardType" | "programme" | "yearGroup";

export default function NewChatScreen() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [awardType, setAwardType] = useState<AwardType | "">("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [startingId, setStartingId] = useState<string | null>(null);

  const departments = useMemo(() => getDepartments(faculty), [faculty]);
  const programmes = useMemo(
    () => (awardType ? getProgrammes(faculty, department, awardType) : []),
    [awardType, department, faculty],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      chatService
        .searchUsers({
          search: search.trim(),
          faculty,
          department,
          programme,
          yearGroup,
          awardType,
        })
        .then(setUsers)
        .catch((error) => {
          Alert.alert(
            "Search failed",
            error instanceof Error ? error.message : "Please try again.",
          );
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [awardType, department, faculty, programme, search, yearGroup]);

  const backRoute = user?.role === "lecturer" ? "/(lecturer)/chats" : "/(student)/chats";

  const startChat = async (targetUser: User) => {
    if (startingId) return;
    try {
      setStartingId(targetUser.id);
      const conversation = await chatService.createDirect(targetUser.id);
      router.replace(
        user?.role === "lecturer"
          ? (`/(lecturer)/chats/${conversation.id}` as any)
          : (`/(student)/chats/${conversation.id}` as any),
      );
    } catch (error) {
      Alert.alert(
        "Could not start chat",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally { setStartingId(null); }
  };

  const dropdown = (
    key: DropdownKey,
    label: string,
    value: string,
    options: string[],
    onSelect: (value: string) => void,
    placeholder = "All",
  ) => (
    <View className="w-[48.5%]">
      <Text className="mb-2 px-1 text-xs font-extrabold tracking-wider text-slate-400">
        {label.toUpperCase()}
      </Text>
      <Pressable
        onPress={() => setOpenDropdown((current) => (current === key ? null : key))}
        disabled={options.length === 0}
        className="flex-row items-center justify-between rounded-2xl border border-[#CFD6E5] bg-white px-4 py-3"
      >
        <Text
          className={`flex-1 text-sm ${value ? "font-bold text-slate-900" : "font-semibold text-slate-400"}`}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name={openDropdown === key ? "chevron-up" : "chevron-down"}
          size={18}
          color="#64748B"
        />
      </Pressable>
      {openDropdown === key ? (
        <View className="mt-2 max-h-64 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
            <Pressable
              onPress={() => {
                onSelect("");
                setOpenDropdown(null);
              }}
              className={`border-b border-slate-100 px-4 py-3 ${!value ? "bg-blue-50" : "bg-white"}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`text-sm ${!value ? "font-bold text-blue-700" : "font-semibold text-slate-700"}`}>
                  All
                </Text>
                {!value ? <Ionicons name="checkmark" size={18} color="#2563EB" /> : null}
              </View>
            </Pressable>
        {options.map((option) => {
          const active = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => {
                onSelect(option);
                setOpenDropdown(null);
              }}
              className={`border-b border-slate-100 px-4 py-3 ${active ? "bg-blue-50" : "bg-white"}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`flex-1 text-sm ${active ? "font-bold text-blue-700" : "font-semibold text-slate-700"}`}>
                  {option}
                </Text>
                {active ? <Ionicons name="checkmark" size={18} color="#2563EB" /> : null}
              </View>
            </Pressable>
          );
        })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader title="New Chat" fallbackRoute={backRoute}/>

      <ScrollView className="flex-1 bg-[#F3F5F8]" contentContainerStyle={{ padding: 16 }}>
        <View className="mb-4 flex-row items-center rounded-2xl border border-[#CFD6E5] bg-white px-4 py-2">
          <Ionicons name="search" size={18} color="#7585A5" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name, email, student ID, or staff ID"
            placeholderTextColor="#8B97B1"
            className="ml-3 flex-1 text-sm text-slate-700"
          />
        </View>

        <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-3"><View className="mb-3 flex-row items-center justify-between"><View><Text className="text-base font-extrabold text-slate-900">Filter people</Text><Text className="text-xs text-slate-500">Narrow results by academic profile</Text></View><Pressable onPress={()=>{setFaculty('');setDepartment('');setProgramme('');setAwardType('');setYearGroup('');setOpenDropdown(null)}}><Text className="text-sm font-bold text-blue-600">Clear</Text></Pressable></View><View className="flex-row flex-wrap justify-between gap-y-3">{dropdown(
          "faculty",
          "Faculty",
          faculty,
          HTU_FACULTIES.map((item) => item.name),
          (value) => {
            setFaculty(value);
            setDepartment("");
            setProgramme("");
          },
        )}
        {dropdown(
          "department",
          "Department",
          department,
          departments.map((item) => item.name),
          (value) => {
            setDepartment(value);
            setProgramme("");
          },
          faculty ? "All departments" : "Select faculty first",
        )}
        {dropdown("awardType", "Award", awardType, AWARD_TYPES, (value) => {
          setAwardType(value as AwardType | "");
          setProgramme("");
        })}
        {dropdown("programme", "Programme", programme, programmes, setProgramme, department ? "All programmes" : "Select department first")}
        {dropdown("yearGroup", "Year Group", yearGroup, [...YEAR_GROUPS], setYearGroup)}</View></View>

        <View className="mt-3 rounded-2xl bg-white">
          <Text className="border-b border-slate-100 px-4 py-3 text-xs font-extrabold tracking-wider text-slate-400">
            {loading ? "SEARCHING..." : "PEOPLE"}
          </Text>
          {users.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => startChat(item)}
              disabled={Boolean(startingId)}
              className={`flex-row items-center border-b border-slate-100 px-4 py-3 ${startingId?'opacity-60':''}`}
            >
              <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Text className="font-extrabold text-blue-700">{getInitials(item.name)}</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-base font-extrabold text-slate-900">{item.name}</Text>
                <Text className="text-xs text-slate-500" numberOfLines={1}>
                  {item.department ?? item.role} {item.programme ? `· ${item.programme}` : ""}
                </Text>
              </View>
              {startingId===item.id?<Text className="text-xs font-bold text-blue-600">Opening...</Text>:<Ionicons name="chatbubble-ellipses-outline" size={20} color="#2563EB" />}
            </Pressable>
          ))}
          {!loading && users.length === 0 ? (
            <View className="items-center px-6 py-10">
              <Text className="text-3xl">🔎</Text>
              <Text className="mt-2 text-center text-sm font-semibold text-slate-500">
                No users found. Try changing the filters.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
