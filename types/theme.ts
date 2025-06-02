export type ThemeColor = 'text' | 'background' | 'tint' | 'icon' | 'tabIconDefault' | 'tabIconSelected' | 'card';

export type Theme = {
  dark: boolean;
  colors: {
    text: string;
    background: string;
    tint: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
    card: string;
  };
}; 