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
import { assignmentService } from "@/src/services/assignment.service";
import { materialService } from "@/src/services/material.service";
import { AssignmentFile } from "@/src/types/assignment.types";
import { MaterialCourse, MaterialType } from "@/src/types/material.types";
const types: { value: MaterialType; label: string }[] = [
  { value: "notes", label: "Lecture Notes" },
  { value: "slides", label: "Slides" },
  { value: "reading", label: "Reading" },
  { value: "reference", label: "Reference" },
  { value: "revision", label: "Revision" },
];
export default function CreateMaterialScreen() {
  const { materialId } = useLocalSearchParams<{ materialId?: string }>();
  const [courses, setCourses] = useState<MaterialCourse[]>([]);
  const [courseId, setCourseId] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState<MaterialType>("notes");
  const [files, setFiles] = useState<AssignmentFile[]>([]);
  const [allowDownload, setAllowDownload] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState(false);
  const editing = Boolean(materialId);
  useEffect(() => {
    const a = materialService.offerings().then(setCourses);
    const b = materialId
      ? materialService.detail(materialId).then((x) => {
          setCourseId(x.course.offeringId);
          setTitle(x.title);
          setDescription(x.description ?? "");
          setTopic(x.topic ?? "");
          setType(x.type);
          setFiles(x.files);
          setAllowDownload(x.allowDownload);
          setPinned(x.pinned);
        })
      : Promise.resolve();
    Promise.all([a, b]).catch((e) =>
      Alert.alert("Could not load form", e.message),
    );
  }, [materialId]);
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
        setFiles((x) => [...x, uploaded]);
      }
    } catch (e) {
      Alert.alert(
        "Upload failed",
        e instanceof Error ? e.message : "Please try again.",
      );
    }
  };
  const save = async (publish: boolean) => {
    if (!courseId || !title.trim() || !files.length)
      return Alert.alert(
        "Missing information",
        "Select a course, enter a title, and upload at least one file.",
      );
    const input = {
      courseOfferingId: courseId,
      title: title.trim(),
      description: description.trim(),
      topic: topic.trim(),
      type: type.toUpperCase(),
      files,
      allowDownload,
      pinned,
      publish,
    };
    try {
      setSaving(true);
      if (materialId) await materialService.update(materialId, input);
      else await materialService.create(input);
      Alert.alert(
        editing
          ? "Material updated"
          : publish
            ? "Material published"
            : "Draft saved",
        "Your course material has been saved.",
        [
          {
            text: "Done",
            onPress: () =>
              router.replace(
                (materialId
                  ? `/(lecturer)/courses/materials/${materialId}`
                  : "/(lecturer)/courses/materials") as any,
              ),
          },
        ],
      );
    } catch (e) {
      Alert.alert(
        "Could not save material",
        e instanceof Error ? e.message : "Please try again.",
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
        title={editing ? "Edit Material" : "Upload Notes & Slides"}
        fallbackRoute={
          materialId
            ? `/(lecturer)/courses/materials/${materialId}`
            : "/(lecturer)/tasks"
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
            onPress={() => !editing && setOpen(!open)}
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
              {selected ? (
                <Text className="mt-1 text-xs text-slate-500">
                  {selected.academicYear} ·{" "}
                  {selected.semester.replace("_", " ")}
                  {editing ? " · Locked" : ""}
                </Text>
              ) : null}
            </View>
            <Ionicons
              name={
                editing
                  ? "lock-closed-outline"
                  : open
                    ? "chevron-up"
                    : "chevron-down"
              }
              size={18}
              color="#64748B"
            />
          </Pressable>
          {open && !editing ? (
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
            placeholder="Material title"
            className={field}
          />
          <TextInput
            value={topic}
            onChangeText={setTopic}
            placeholder="Topic or week (optional)"
            className={field}
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            placeholder="Description (optional)"
            className={`${field} min-h-24`}
          />
          <Text className="text-xs font-extrabold text-slate-500">
            MATERIAL TYPE
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {types.map((t) => (
              <Pressable
                key={t.value}
                onPress={() => setType(t.value)}
                className={`rounded-lg px-3 py-2 ${type === t.value ? "bg-blue-600" : "bg-white"}`}
              >
                <Text
                  className={`font-bold ${type === t.value ? "text-white" : "text-slate-600"}`}
                >
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={pick}
            className="items-center rounded-lg border border-dashed border-blue-300 bg-blue-50 py-4"
          >
            <Text className="font-bold text-blue-700">📎 Upload files</Text>
          </Pressable>
          {files.map((f, i) => (
            <View
              key={`${f.uri}-${i}`}
              className="flex-row items-center rounded-lg bg-white p-3"
            >
              <Text
                className="flex-1 font-semibold text-slate-700"
                numberOfLines={1}
              >
                {f.name}
              </Text>
              <Pressable
                onPress={() => setFiles((x) => x.filter((_, n) => n !== i))}
              >
                <Text className="font-bold text-red-600">Remove</Text>
              </Pressable>
            </View>
          ))}
          <View className="rounded-lg bg-white px-4">
            {[
              ["Allow student download", allowDownload, setAllowDownload],
              ["Pin as important", pinned, setPinned],
            ].map(([label, value, setter]: any) => (
              <View
                key={label}
                className="flex-row items-center justify-between border-b border-slate-100 py-3"
              >
                <Text className="font-semibold text-slate-700">{label}</Text>
                <Switch value={value} onValueChange={setter} />
              </View>
            ))}
          </View>
          {editing ? (
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
                onPress={() => void save(false)}
                className="flex-1 items-center rounded-lg border border-blue-600 py-3"
              >
                <Text className="font-bold text-blue-700">Save Draft</Text>
              </Pressable>
              <Pressable
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
