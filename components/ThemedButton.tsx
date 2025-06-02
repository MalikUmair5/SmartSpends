import { StyleSheet, Text, Touchable, TouchableOpacity, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
  type?: 'default' | 'full-width';
  textColor?: string;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  children,
  type = 'default',
  textColor,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TouchableOpacity
        style={[
          { backgroundColor: color },
          type === 'full-width' ? styles.fullWidthButton : styles.button
        ]}
      {...rest}
    >
     <Text style={color === "#11181C" ? {color: "white"} : {color: "11181C"}}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButton:{
    width: '100%',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
