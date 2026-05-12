import { Modal, Pressable, Text, View } from 'react-native';

interface LogoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutModal({
  visible,
  onCancel,
  onConfirm,
}: LogoutModalProps) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onCancel} />

      <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6">
        <View className="mb-4 items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Text className="text-4xl">🚪</Text>
          </View>
        </View>

        <Text className="mb-2 text-center text-2xl font-extrabold text-slate-900">
          Log Out?
        </Text>

        <Text className="mb-8 text-center text-sm leading-5 text-slate-400">
          Are you sure you want to log out? You&apos;ll{'\n'}need to sign in again
          to access your{'\n'}messages.
        </Text>

        <Pressable
          onPress={onConfirm}
          className="mb-3 items-center rounded-2xl bg-red-500 py-4"
        >
          <Text className="text-base font-bold text-white">Yes, Log Out</Text>
        </Pressable>

        <Pressable
          onPress={onCancel}
          className="items-center rounded-2xl bg-slate-100 py-4"
        >
          <Text className="text-base font-semibold text-slate-600">Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
