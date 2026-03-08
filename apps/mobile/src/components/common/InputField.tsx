import type React from 'react';
import { TextInput } from 'react-native';

export function InputField(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput {...props} className={`rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg text-slate-900 ${props.className ?? ''}`} />;
}




