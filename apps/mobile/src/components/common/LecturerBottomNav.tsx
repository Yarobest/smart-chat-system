import { router } from "expo-router";
import { BottomNav } from "@/src/components/common/BottomNav";

type LecturerTab = "home" | "chats" | "courses" | "tasks";

type Props = {
  active?: LecturerTab;
  unreadCount?: number;
};

export function LecturerBottomNav({ active, unreadCount = 0 }: Props) {
  return (
    <BottomNav
      items={[
        {
          label: "Home",
          icon: "home-outline",
          active: active === "home",
          onPress: () => router.replace("/(lecturer)/home"),
        },
        {
          label: "Chats",
          icon: "chatbubbles-outline",
          badge: unreadCount,
          active: active === "chats",
          onPress: () => router.replace("/(lecturer)/chats"),
        },
        {
          label: "Courses",
          icon: "library-outline",
          active: active === "courses",
          onPress: () => router.replace("/(lecturer)/courses"),
        },
        {
          label: "Course Tools",
          icon: "construct-outline",
          active: active === "tasks",
          onPress: () => router.replace("/(lecturer)/tasks" as any),
        },
      ]}
    />
  );
}
