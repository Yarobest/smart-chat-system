import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

type Props = { style?: 'light' | 'dark' | 'auto'; backgroundColor?: string };

export function StatusBar({ style = 'light', backgroundColor }: Props) {
  return <ExpoStatusBar style={style} hidden={false} backgroundColor={backgroundColor} />;
}
