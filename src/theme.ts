export const COLORS = {
  primary: '#0A5C38',
  primaryDark: '#073D25',
  primaryLight: '#E6F4EE',
  background: '#F2F7F5',
  card: '#FFFFFF',
  text: '#0D1F17',
  textSecondary: '#5A7A6B',
  border: '#D0E8DC',
  warning: '#FFF8E1',
  warningText: '#F57F17',
  error: '#D32F2F',
  resultBg: '#E6F4EE',
};

export const FREQUENCE_LABELS: Record<string, string> = {
  SID: "1x/jour",
  BID: "2x/jour",
  TID: "3x/jour",
  QID: "4x/jour",
};

export function formatFrequence(f: string | null): string | null {
  if (!f) return null;
  return FREQUENCE_LABELS[f] ?? f;
}

export const FONTS = {
  regular: 'Poppins_400Regular',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
};
