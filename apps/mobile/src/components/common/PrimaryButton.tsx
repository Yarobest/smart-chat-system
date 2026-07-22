import { AsyncButton } from './AsyncButton';

export function PrimaryButton({ label, onPress, loading=false, disabled=false }: { label: string; onPress?: () => void; loading?:boolean;disabled?:boolean }) {
  return <AsyncButton label={label} onPress={onPress??(()=>undefined)} loading={loading} disabled={disabled}/>;
}
