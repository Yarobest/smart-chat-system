import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, ReactNode } from 'react';

export function SettingsSectionTitle({children}:{children:string}){return <Text className="mb-3 text-xs font-extrabold tracking-wide text-slate-400">{children}</Text>}
export function SettingsRow({icon,label,right,onPress}:{icon:ComponentProps<typeof Ionicons>['name'];label:string;right?:ReactNode;onPress?:()=>void}){return <Pressable disabled={!onPress&&!right} onPress={onPress} className="mb-3 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4"><View className="mr-3 flex-1 flex-row items-center"><View className="mr-3 h-9 w-9 items-center justify-center rounded-lg bg-slate-100"><Ionicons name={icon} size={19} color="#64748B" /></View><Text numberOfLines={1} className="flex-1 text-base font-semibold text-slate-900">{label}</Text></View>{right??<Text className="text-base text-slate-400">›</Text>}</Pressable>}
