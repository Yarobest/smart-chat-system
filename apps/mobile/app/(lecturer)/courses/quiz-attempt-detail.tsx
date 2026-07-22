import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "@/src/components/common/StatusBar";
import { ScreenHeader } from "@/src/components/common/ScreenHeader";
import { KeyboardAwareView } from "@/src/components/common/KeyboardAwareView";
import { quizService } from "@/src/services/quiz.service";

export default function QuizAttemptDetail() {
  const { quizId, attemptId } = useLocalSearchParams<{
    quizId: string;
    attemptId: string;
  }>();
  const [data, setData] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [grading, setGrading] = useState<string | null>(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const load = useCallback(() => {
    if (!quizId || !attemptId) return;
    quizService
      .attempts(quizId)
      .then((result) => {
        setData(result);
        const found = result.attempts.find(
          (item: any) => item.id === attemptId,
        );
        if (!found) throw new Error("Attempt not found");
        setAttempt(found);
      })
      .catch((e) => Alert.alert("Could not load attempt", e.message));
  }, [quizId, attemptId]);
  useEffect(() => load(), [load]);
  if (!data || !attempt)
    return <SafeAreaView className="flex-1 bg-[#F5F7FA]" />;
  const total = data.questions.reduce((s: number, q: any) => s + q.marks, 0);
  const answerMap = new Map(attempt.answers.map((a: any) => [a.questionId, a]));
  const started = new Date(attempt.startedAt),
    ended = attempt.submittedAt ? new Date(attempt.submittedAt) : new Date();
  const minutes = Math.max(
    1,
    Math.ceil((ended.getTime() - started.getTime()) / 60000),
  );
  const grade = async (answer: any) => {
    try {
      setSaving(true);
      await quizService.grade(
        data.id,
        attempt.id,
        answer.id,
        Number(marks),
        feedback,
      );
      setGrading(null);
      setMarks("");
      setFeedback("");
      load();
    } catch (e) {
      Alert.alert(
        "Could not grade answer",
        e instanceof Error ? e.message : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-[#051839]">
      <StatusBar style="light" backgroundColor="#051839" />
      <ScreenHeader
        title="Attempt Details"
        fallbackRoute={`/(lecturer)/courses/quiz-attempts?quizId=${quizId}`}
      />
      <KeyboardAwareView>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          className="flex-1 bg-[#F5F7FA]"
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}
        >
          <View className="rounded-2xl bg-[#0B2A59] p-4">
            <View className="flex-row justify-between gap-3">
              <View>
                <Text className="text-lg font-extrabold text-white">
                  {attempt.student.name}
                </Text>
                <Text className="text-sm text-blue-100">
                  {attempt.student.studentId ?? "Student"} · Attempt{" "}
                  {attempt.attemptNumber}
                </Text>
              </View>
              <Text className="text-xl font-extrabold text-white">
                {attempt.totalScore ?? "-"}/{total}
              </Text>
            </View>
            <View className="mt-4 flex-row justify-between">
              <Text className="text-xs text-blue-200">
                Started {started.toLocaleString()}
              </Text>
              <Text className="text-xs text-blue-200">{minutes} min used</Text>
            </View>
          </View>
          {data.questions.map((question: any, index: number) => {
            const answer: any = answerMap.get(question.id);
            const studentAnswer = answer?.answer;
            const objective = question.type !== "SHORT_ANSWER";
            const correct =
              objective &&
              JSON.stringify(studentAnswer ?? null) ===
                JSON.stringify(question.correctAnswer);
            return (
              <View
                key={question.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <View className="flex-row justify-between gap-3">
                  <Text className="flex-1 text-xs font-extrabold text-blue-600">
                    QUESTION {index + 1} · {question.type.replace("_", " ")}
                  </Text>
                  <Text className="text-xs font-bold text-slate-500">
                    {answer?.awardedMarks ?? "-"}/{question.marks}
                  </Text>
                </View>
                <Text className="mt-3 text-base font-bold leading-6 text-slate-900">
                  {question.text}
                </Text>
                {objective ? (
                  <View className="mt-4 gap-2">
                    {(question.options ?? []).map((option: string) => {
                      const selected = String(studentAnswer) === option;
                      const isCorrect =
                        String(question.correctAnswer) === option;
                      return (
                        <View
                          key={option}
                          className={`flex-row items-center rounded-xl border px-3 py-3 ${isCorrect ? "border-emerald-400 bg-emerald-50" : selected ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`}
                        >
                          <View
                            className={`mr-3 h-6 w-6 items-center justify-center rounded-full border ${isCorrect ? "border-emerald-600 bg-emerald-600" : selected ? "border-red-500 bg-red-500" : "border-slate-300"}`}
                          >
                            <Text className="text-xs font-bold text-white">
                              {isCorrect ? "✓" : selected ? "✕" : ""}
                            </Text>
                          </View>
                          <Text
                            className={`flex-1 font-semibold ${isCorrect ? "text-emerald-800" : selected ? "text-red-800" : "text-slate-600"}`}
                          >
                            {option}
                          </Text>
                          {isCorrect ? (
                            <Text className="text-xs font-extrabold text-emerald-700">
                              CORRECT
                            </Text>
                          ) : selected ? (
                            <Text className="text-xs font-extrabold text-red-700">
                              STUDENT
                            </Text>
                          ) : null}
                        </View>
                      );
                    })}
                    {studentAnswer === null ||
                    studentAnswer === undefined ||
                    studentAnswer === "" ? (
                      <Text className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-500">
                        Unanswered
                      </Text>
                    ) : (
                      <Text
                        className={`mt-1 text-xs font-bold ${correct ? "text-emerald-700" : "text-red-700"}`}
                      >
                        {correct
                          ? "Correct answer selected"
                          : "Student answer was incorrect"}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View className="mt-4">
                    <View className="rounded-xl bg-slate-50 p-3">
                      <Text className="text-xs font-bold text-slate-400">
                        STUDENT RESPONSE
                      </Text>
                      <Text className="mt-2 text-sm leading-6 text-slate-700">
                        {String(studentAnswer ?? "No answer provided")}
                      </Text>
                    </View>
                    {answer ? (
                      <>
                        <Pressable
                          onPress={() => {
                            setGrading(answer.id);
                            setMarks(answer.awardedMarks?.toString() ?? "");
                            setFeedback(answer.feedback ?? "");
                          }}
                          className="mt-3 items-center rounded-full bg-blue-50 py-3"
                        >
                          <Text className="font-bold text-blue-700">
                            {answer.awardedMarks !== null
                              ? "Update Marks"
                              : "Grade Short Answer"}
                          </Text>
                        </Pressable>
                        {grading === answer.id ? (
                          <View className="mt-3 gap-2">
                            <TextInput
                              value={marks}
                              onChangeText={setMarks}
                              keyboardType="number-pad"
                              placeholder={`Marks out of ${question.marks}`}
                              className="rounded-xl border border-slate-200 p-3"
                            />
                            <TextInput
                              value={feedback}
                              onChangeText={setFeedback}
                              multiline
                              placeholder="Feedback"
                              className="min-h-20 rounded-xl border border-slate-200 p-3"
                            />
                            <Pressable
                              disabled={saving || !marks.trim()}
                              onPress={() => void grade(answer)}
                              className={`items-center rounded-full py-3 ${saving || !marks.trim() ? "bg-slate-300" : "bg-blue-600"}`}
                            >
                              <Text className="font-bold text-white">
                                {saving ? "Saving..." : "Save Grade"}
                              </Text>
                            </Pressable>
                          </View>
                        ) : null}
                      </>
                    ) : null}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </KeyboardAwareView>
    </SafeAreaView>
  );
}
