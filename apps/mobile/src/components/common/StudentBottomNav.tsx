import { router } from "expo-router";
import { BottomNav } from "@/src/components/common/BottomNav";

type StudentTab = "home" | "chats" | "courses" | "tasks";

type Props = {
  active?: StudentTab;
  unreadCount?: number;
};

export function StudentBottomNav({ active, unreadCount = 0 }: Props) {
  return (
    <BottomNav
      items={[
        {
          label: "Home",
          icon: "home-outline",
          active: active === "home",
          onPress: () => router.replace("/(student)/home"),
        },
        {
          label: "Chats",
          icon: "chatbubbles-outline",
          badge: unreadCount,
          active: active === "chats",
          onPress: () => router.replace("/(student)/chats"),
        },
        {
          label: "Courses",
          icon: "library-outline",
          active: active === "courses",
          onPress: () => router.replace("/(student)/courses"),
        },
        {
          label: "Coursework",
          icon: "document-text-outline",
          active: active === "tasks",
          onPress: () => router.replace("/(student)/tasks"),
        },
      ]}
    />
  );
}
