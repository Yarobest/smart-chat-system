import { Text, View } from 'react-native';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <View className="bg-[#051839] px-4 pb-5 pt-6">
      <Text className="text-2xl font-extrabold text-white" numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-sm text-slate-300" numberOfLines={2} ellipsizeMode="tail">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
