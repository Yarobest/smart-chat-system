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
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "@/src/components/common/StatusBar";
import { ScreenHeader } from "@/src/components/common/ScreenHeader";
import { KeyboardAwareView } from "@/src/components/common/KeyboardAwareView";
import { announcementService } from "@/src/services/announcement.service";
import { assignmentService } from "@/src/services/assignment.service";
import {
  AnnouncementCourse,
  AnnouncementPriority,
} from "@/src/types/announcement.types";
import { AssignmentFile } from "@/src/types/assignment.types";
export default function ComposeAnnouncementScreen() {
  const { announcementId } = useLocalSearchParams<{
    announcementId?: string;
  }>();
  const [courses, setCourses] = useState<AnnouncementCourse[]>([]);
  const [courseId, setCourseId] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<AnnouncementPriority>("normal");
  const [attachments, setAttachments] = useState<AssignmentFile[]>([]);
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    Promise.all([
      announcementService.offerings().then(setCourses),
      announcementId
        ? announcementService.detail(announcementId).then((x) => {
            setCourseId(x.course.offeringId);
            setTitle(x.title);
            setBody(x.body);
            setPriority(x.priority);
            setAttachments(x.attachments);
            setPinned(x.pinned);
          })
        : Promise.resolve(),
    ]).catch((e) => Alert.alert("Could not load form", e.message));
  }, [announcementId]);
  const selected = courses.find((x) => x.id === courseId);
  const pick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    try {
      for (const file of result.assets) {
        const uploaded = await assignmentService.uploadFile(file);
        setAttachments((x) => [...x, uploaded]);
      }
    } catch (e) {
      Alert.alert(
        "Upload failed",
        e instanceof Error ? e.message : "Try again.",
      );
    }
  };
  const save = async (publish: boolean) => {
    if (!courseId || !title.trim() || !body.trim())
      return Alert.alert(
        "Missing information",
        "Select a course, enter a title and write the announcement.",
      );
    try {
      setSaving(true);
      const input = {
        courseOfferingId: courseId,
        title: title.trim(),
        body: body.trim(),
        priority,
        attachments,
        pinned,
        publish,
      };
      if (announcementId)
        await announcementService.update(announcementId, input);
      else await announcementService.create(input);
      Alert.alert(
        announcementId
          ? "Announcement updated"
          : publish
            ? "Announcement published"
            : "Draft saved",
        "The announcement has been saved.",
        [
          {
            text: "Done",
            onPress: () =>
              router.replace(
                (announcementId
                  ? `/(lecturer)/announcements/${announcementId}`
                  : "/(lecturer)/announcements") as any,
              ),
          },
        ],
      );
    } catch (e) {
      Alert.alert(
        "Could not save",
        e instanceof Error ? e.message : "Try again.",
      );
    } finally {
      setSaving(false);
    }
  };
  const field = "rounded-lg border border-slate-200 bg-white px-4 py-3";
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader
        title={announcementId ? "Edit Announcement" : "New Announcement"}
        fallbackRoute={
          announcementId
            ? `/(lecturer)/announcements/${announcementId}`
            : "/(lecturer)/announcements"
        }
      />
      <KeyboardAwareView>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          className="flex-1 bg-[#F5F7FA]"
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}
        >
          <Text className="text-xs font-extrabold text-slate-500">COURSE</Text>
          <Pressable
            onPress={() => !announcementId && setOpen(!open)}
            className="flex-row items-center rounded-lg border border-slate-200 bg-white p-4"
          >
            <View className="flex-1">
              <Text
                className={
                  selected ? "font-bold text-slate-900" : "text-slate-400"
                }
              >
                {selected
                  ? `${selected.courseCode} · ${selected.courseName}`
                  : "Select a course"}
              </Text>
            </View>
            <Ionicons
              name={
                announcementId
                  ? "lock-closed-outline"
                  : open
                    ? "chevron-up"
                    : "chevron-down"
              }
              size={18}
              color="#64748B"
            />
          </Pressable>
          {open && !announcementId ? (
            <View className="rounded-lg border border-slate-200 bg-white">
              {courses.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => {
                    setCourseId(c.id);
                    setOpen(false);
                  }}
                  className="border-b border-slate-100 p-4"
                >
                  <Text className="font-bold text-slate-800">
                    {c.courseCode} · {c.courseName}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {c.academicYear} · {c.semester.replace("_", " ")}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Announcement title"
            className={field}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Write the official announcement"
            multiline
            textAlignVertical="top"
            className={`${field} min-h-36`}
          />
          <Text className="text-xs font-extrabold text-slate-500">
            PRIORITY
          </Text>
          <View className="flex-row gap-2">
            {(["normal", "important", "urgent"] as AnnouncementPriority[]).map(
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
          <Pressable
            onPress={pick}
            className="items-center rounded-lg border border-dashed border-blue-300 bg-blue-50 py-4"
          >
            <Text className="font-bold text-blue-700">📎 Add attachments</Text>
          </Pressable>
          {attachments.map((f, i) => (
            <View
              key={`${f.uri}-${i}`}
              className="flex-row rounded-lg bg-white p-3"
            >
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
            <View>
              <Text className="font-bold text-slate-700">Pin announcement</Text>
              <Text className="text-xs text-slate-400">
                Keep it above regular announcements
              </Text>
            </View>
            <Switch value={pinned} onValueChange={setPinned} />
          </View>
          {announcementId ? (
            <Pressable
              disabled={saving}
              onPress={() => void save(false)}
              className="items-center rounded-lg bg-blue-600 py-3"
            >
              <Text className="font-bold text-white">
                {saving ? "Saving..." : "Save Changes"}
              </Text>
            </Pressable>
          ) : (
            <View className="flex-row gap-3">
              <Pressable
                disabled={saving}
                onPress={() => void save(false)}
                className="flex-1 items-center rounded-lg border border-blue-600 py-3"
              >
                <Text className="font-bold text-blue-700">Save Draft</Text>
              </Pressable>
              <Pressable
                disabled={saving}
                onPress={() => void save(true)}
                className="flex-1 items-center rounded-lg bg-blue-600 py-3"
              >
                <Text className="font-bold text-white">Publish</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAwareView>
    </SafeAreaView>
  );
}
