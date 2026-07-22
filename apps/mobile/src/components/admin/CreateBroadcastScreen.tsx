import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "../common/StatusBar";
import { ScreenHeader } from "../common/ScreenHeader";
import { KeyboardAwareView } from "../common/KeyboardAwareView";
import { assignmentService } from "@/src/services/assignment.service";
import { broadcastService } from "@/src/services/broadcast.service";
import { AssignmentFile } from "@/src/types/assignment.types";
import { BroadcastPriority } from "@/src/types/broadcast.types";
const audiences = [
  { label: "Everyone", role: null },
  { label: "All Students", role: "STUDENT" },
  { label: "All Lecturers", role: "LECTURER" },
  { label: "All Administrators", role: "ADMIN" },
] as const;
export default function CreateBroadcastScreen() {
  const { broadcastId } = useLocalSearchParams<{ broadcastId?: string }>();
  const [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [priority, setPriority] = useState<BroadcastPriority>("normal"),
    [audience, setAudience] = useState<(typeof audiences)[number]>(
      audiences[0],
    ),
    [faculty, setFaculty] = useState(""),
    [department, setDepartment] = useState(""),
    [programme, setProgramme] = useState(""),
    [yearGroup, setYearGroup] = useState(""),
    [attachments, setAttachments] = useState<AssignmentFile[]>([]),
    [pinned, setPinned] = useState(false),
    [scheduleAt, setScheduleAt] = useState(new Date(Date.now() + 86400000)),
    [showDate, setShowDate] = useState(false),
    [showTime, setShowTime] = useState(false),
    [count, setCount] = useState(0),
    [saving, setSaving] = useState(false);
  const payload = {
    audienceLabel: [audience.label, faculty, department, programme, yearGroup]
      .filter(Boolean)
      .join(" · "),
    audienceRole: audience.role,
    faculty: faculty || undefined,
    department: department || undefined,
    programme: programme || undefined,
    yearGroup: yearGroup || undefined,
  };
  useEffect(() => {
    const timer = setTimeout(
      () =>
        broadcastService
          .count(payload)
          .then((x) => setCount(x.count))
          .catch(() => setCount(0)),
      250,
    );
    return () => clearTimeout(timer);
  }, [audience.role, faculty, department, programme, yearGroup]);
  useEffect(() => {
    if (broadcastId)
      broadcastService
        .detail(broadcastId)
        .then((x) => {
          setTitle(x.title);
          setBody(x.body);
          setPriority(x.priority);
          setAudience(
            audiences.find((a) => a.role?.toLowerCase() === x.audienceRole) ??
              audiences[0],
          );
          setFaculty(x.faculty ?? "");
          setDepartment(x.department ?? "");
          setProgramme(x.programme ?? "");
          setYearGroup(x.yearGroup ?? "");
          setAttachments(x.attachments);
          setPinned(x.pinned);
          if (x.scheduledAt) setScheduleAt(new Date(x.scheduledAt));
        })
        .catch((e) => Alert.alert("Could not load", e.message));
  }, [broadcastId]);
  const pick = async () => {
    const r = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (r.canceled) return;
    for (const f of r.assets) {
      try {
        const uploaded = await assignmentService.uploadFile(f);
        setAttachments((x) => [...x, uploaded]);
      } catch (e) {
        Alert.alert(
          "Upload failed",
          e instanceof Error ? e.message : "Try again.",
        );
      }
    }
  };
  const save = async (action: "draft" | "schedule" | "publish") => {
    if (saving) return;
    if (!title.trim() || !body.trim())
      return Alert.alert("Missing information", "Enter a title and message.");
    const run = async () => {
      try {
        setSaving(true);
        const input = {
          ...payload,
          title: title.trim(),
          body: body.trim(),
          priority,
          attachments,
          pinned,
          action,
          status:
            broadcastId && action !== "publish"
              ? action === "schedule"
                ? "scheduled"
                : "draft"
              : undefined,
          scheduledAt:
            action === "schedule" ? scheduleAt.toISOString() : undefined,
        };
        if (broadcastId) await broadcastService.update(broadcastId, input);
        else await broadcastService.create(input);
        if (broadcastId && action === "publish")
          await broadcastService.publish(broadcastId);
        Alert.alert(
          action === "publish"
            ? "Broadcast published"
            : action === "schedule"
              ? "Broadcast scheduled"
              : "Draft saved",
          action === "publish"
            ? `Delivered to ${count} recipient${count === 1 ? "" : "s"}.`
            : "Your changes were saved.",
          [
            {
              text: "Done",
              onPress: () =>
                router.replace("/(admin)/broadcast/broad-cast" as any),
            },
          ],
        );
      } catch (e) {
        Alert.alert(
          "Could not save broadcast",
          e instanceof Error ? e.message : "Try again.",
        );
      } finally {
        setSaving(false);
      }
    };
    if (action === "publish")
      Alert.alert(
        "Confirm school broadcast",
        `Publish this ${priority} broadcast to ${count} recipient${count === 1 ? "" : "s"}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Publish",
            style: priority === "urgent" ? "destructive" : "default",
            onPress: () => void run(),
          },
        ],
      );
    else void run();
  };
  const field =
    "rounded-lg border border-slate-200 bg-white px-4 py-3 text-base text-slate-900";
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader
        title={broadcastId ? "Edit Broadcast" : "Create Broadcast"}
        fallbackRoute="/(admin)/broadcast/broad-cast"
      />
      <KeyboardAwareView>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          className="flex-1 bg-[#F5F7FA]"
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 130 }}
        >
          <View className="rounded-2xl bg-blue-50 p-4">
            <Text className="text-sm font-extrabold text-blue-900">
              Estimated audience
            </Text>
            <Text className="mt-1 text-2xl font-extrabold text-blue-700">
              {count} recipients
            </Text>
          </View>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Broadcast title"
            className={field}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Official message"
            multiline
            textAlignVertical="top"
            className={`${field} min-h-36`}
          />
          <Text className="text-xs font-extrabold text-slate-500">
            PRIORITY
          </Text>
          <View className="flex-row gap-2">
            {(["normal", "important", "urgent"] as BroadcastPriority[]).map(
              (p) => (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  className={`flex-1 items-center rounded-lg py-3 ${priority === p ? (p === "urgent" ? "bg-red-600" : p === "important" ? "bg-amber-500" : "bg-blue-600") : "bg-white"}`}
                >
                  <Text
                    className={`font-bold capitalize ${priority === p ? "text-white" : "text-slate-600"}`}
                  >
                    {p}
                  </Text>
                </Pressable>
              ),
            )}
          </View>
          <Text className="text-xs font-extrabold text-slate-500">
            AUDIENCE
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {audiences.map((a) => (
              <Pressable
                key={a.label}
                onPress={() => setAudience(a)}
                className={`rounded-lg px-3 py-2 ${audience.label === a.label ? "bg-blue-600" : "bg-white"}`}
              >
                <Text
                  className={`font-bold ${audience.label === a.label ? "text-white" : "text-slate-600"}`}
                >
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="text-xs text-slate-500">Optional targeting</Text>
          {[
            [faculty, setFaculty, "Faculty"],
            [department, setDepartment, "Department"],
            [programme, setProgramme, "Programme"],
            [yearGroup, setYearGroup, "Year group"],
          ].map(([v, set, p]: any) => (
            <TextInput
              key={p}
              value={v}
              onChangeText={set}
              placeholder={p}
              className={field}
            />
          ))}
          <Pressable
            onPress={() => void pick()}
            className="items-center rounded-lg border border-dashed border-blue-300 bg-blue-50 py-4"
          >
            <Text className="font-bold text-blue-700">📎 Add attachments</Text>
          </Pressable>
          {attachments.map((f, i) => (
            <View key={f.uri} className="flex-row rounded-lg bg-white p-3">
              <Text
                numberOfLines={1}
                className="flex-1 font-semibold text-slate-700"
              >
                {f.name}
              </Text>
              <Pressable
                onPress={() =>
                  setAttachments((x) => x.filter((_, n) => n !== i))
                }
              >
                <Text className="font-bold text-red-600">Remove</Text>
              </Pressable>
            </View>
          ))}
          <View className="flex-row items-center justify-between rounded-lg bg-white p-4">
            <Text className="font-bold text-slate-700">Pin broadcast</Text>
            <Switch value={pinned} onValueChange={setPinned} />
          </View>
          <View className="rounded-lg bg-white p-4">
            <Text className="font-bold text-slate-700">Schedule time</Text>
            <View className="mt-3 flex-row gap-2">
              <Pressable
                onPress={() => setShowDate(true)}
                className="flex-1 rounded-lg bg-slate-100 p-3"
              >
                <Text className="text-center font-semibold">
                  {scheduleAt.toLocaleDateString()}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowTime(true)}
                className="flex-1 rounded-lg bg-slate-100 p-3"
              >
                <Text className="text-center font-semibold">
                  {scheduleAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>
            </View>
          </View>
          {showDate ? (
            <DateTimePicker
              value={scheduleAt}
              mode="date"
              minimumDate={new Date()}
              onChange={(_, d) => {
                setShowDate(false);
                if (d) setScheduleAt(d);
              }}
            />
          ) : null}
          {showTime ? (
            <DateTimePicker
              value={scheduleAt}
              mode="time"
              onChange={(_, d) => {
                setShowTime(false);
                if (d) setScheduleAt(d);
              }}
            />
          ) : null}
          <View className="flex-row flex-wrap gap-2">
            {(
              [
                { a: "draft", l: "Save Draft" },
                { a: "schedule", l: "Schedule" },
                { a: "publish", l: "Publish Now" },
              ] as const
            ).map((x) => (
              <Pressable
                key={x.a}
                disabled={saving}
                onPress={() => void save(x.a)}
                className={`w-[48%] items-center rounded-lg py-3 ${x.a === "publish" ? "bg-blue-600" : x.a === "schedule" ? "bg-amber-500" : "border border-blue-600 bg-white"} ${saving ? "opacity-50" : ""}`}
              >
                <Text
                  className={`font-bold ${x.a === "draft" ? "text-blue-700" : "text-white"}`}
                >
                  {saving ? "Please wait..." : x.l}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </KeyboardAwareView>
    </SafeAreaView>
  );
}
