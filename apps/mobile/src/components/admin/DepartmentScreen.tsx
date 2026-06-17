import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const departments = [
  {
    name: 'Computer Science',
    code: 'CS',
    students: 312,
    lecturers: 8,
    courses: 12,
    engagement: '85%',
    width: 'w-[85%]',
    color: 'bg-blue-500',
    border: 'border-blue-500',
  },
  {
    name: 'Engineering Technology',
    code: 'ET',
    students: 280,
    lecturers: 10,
    courses: 14,
    engagement: '62%',
    width: 'w-[62%]',
    color: 'bg-emerald-500',
    border: 'border-emerald-500',
  },
  {
    name: 'Business Studies',
    code: 'BS',
    students: 395,
    lecturers: 12,
    courses: 16,
    engagement: '47%',
    width: 'w-[47%]',
    color: 'bg-orange-400',
    border: 'border-orange-400',
  },
  {
    name: 'Hospitality Management',
    code: 'HM',
    students: 180,
    lecturers: 6,
    courses: 8,
    engagement: '38%',
    width: 'w-[38%]',
    color: 'bg-purple-500',
    border: 'border-purple-500',
  },
  {
    name: 'Accounting',
    code: 'AC',
    students: 210,
    lecturers: 7,
    courses: 9,
    engagement: '54%',
    width: 'w-[54%]',
    color: 'bg-cyan-500',
    border: 'border-cyan-500',
  },
];

export default function DepartmentManagement() {
  return (
    <SafeAreaView className="flex-1 bg-[#0F2341]">
      <ScrollView
        className="flex-1 bg-[#EEF3FB]"
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-[#0F2341] px-5 pb-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-extrabold text-white">Departments</Text>
              <Text className="mt-1 text-xs font-semibold text-blue-200">
                5 departments · HTU
              </Text>
            </View>

            <Pressable className="h-9 w-9 items-center justify-center rounded-md bg-blue-600">
              <Text className="text-xl font-bold text-white">+</Text>
            </Pressable>
          </View>
        </View>

        <View className="px-5 pt-4">
          <View className="flex-row items-center rounded-[14px] border border-slate-300 bg-slate-100 px-4 py-3">
            <Text className="mr-2 text-lg">🔍</Text>
            <TextInput
              placeholder="Search departments..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-sm text-slate-700"
            />
          </View>

          <View className="mt-4">
            {departments.map((dept) => (
              <View
                key={dept.code}
                className={`mb-4 rounded-[20px] border-l-4 bg-white p-4 shadow-sm shadow-slate-200 ${dept.border}`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-xl font-extrabold text-slate-900">
                      {dept.name}
                    </Text>

                    <Text className="mt-1 text-xs text-slate-400">
                      Code: {dept.code} · HND Programme
                    </Text>
                  </View>

                  <View className="rounded-full bg-emerald-100 px-3 py-1">
                    <Text className="text-[10px] font-extrabold text-emerald-600">
                      Active
                    </Text>
                  </View>
                </View>

                <View className="mt-4 flex-row flex-wrap">
                  <Text className="mr-3 text-xs text-slate-500">
                    👥 {dept.students} students
                  </Text>

                  <Text className="mr-3 text-xs text-slate-500">
                    👨‍🏫 {dept.lecturers} lecturers
                  </Text>

                  <Text className="text-xs text-slate-500">
                    📚 {dept.courses} courses
                  </Text>
                </View>

                <View className="mt-4">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-xs font-semibold text-slate-500">
                      Engagement
                    </Text>

                    <Text className="text-xs font-extrabold text-slate-700">
                      {dept.engagement}
                    </Text>
                  </View>

                  <View className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <View
                      className={`h-full rounded-full ${dept.width} ${dept.color}`}
                    />
                  </View>
                </View>

                <View className="mt-5 flex-row justify-between">
                  <Pressable className="w-[31%] rounded-lg bg-blue-50 py-2">
                    <Text className="text-center text-xs font-extrabold text-blue-600">
                      View
                    </Text>
                  </Pressable>

                  <Pressable className="w-[31%] rounded-lg bg-orange-50 py-2">
                    <Text className="text-center text-xs font-extrabold text-orange-600">
                      Edit
                    </Text>
                  </Pressable>

                  <Pressable className="w-[31%] rounded-lg bg-emerald-50 py-2">
                    <Text className="text-center text-xs font-extrabold text-emerald-600">
                      Broadcast
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}