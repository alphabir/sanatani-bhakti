import { Platform, Vibration } from 'react-native';

export function vibrate(pattern: number | number[] = 30) {
  if (Platform.OS === 'web') return;
  Vibration.vibrate(pattern);
}
