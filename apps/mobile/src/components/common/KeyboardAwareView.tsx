import { KeyboardAvoidingView } from "react-native";
export function KeyboardAwareView({
  children,
  keyboardVerticalOffset = 16,
}: {
  children: React.ReactNode;
  keyboardVerticalOffset?: number;
}) {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
