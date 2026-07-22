import { ActivityIndicator, Text, View } from 'react-native';
export function PageLoader({ label = 'Loading...' }: { label?: string }) { return <View className="flex-1 items-center justify-center bg-[#F5F7FA] px-6"><ActivityIndicator size="large" color="#2563EB"/><Text className="mt-3 text-sm font-semibold text-slate-500">{label}</Text></View>; }
