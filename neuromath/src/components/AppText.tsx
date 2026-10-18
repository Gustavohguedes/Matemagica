import {
  StyleSheet,
  Text as NativeText,
  type TextProps,
} from "react-native";

const REGULAR_FONT = "AtkinsonHyperlegible_400Regular";
const BOLD_FONT = "AtkinsonHyperlegible_700Bold";

export function AppText({ style, ...props }: TextProps) {
  const textStyle = StyleSheet.flatten(style);
  const weight = textStyle?.fontWeight;
  const fontFamily =
    weight === "bold" ||
    weight === "500" ||
    weight === "600" ||
    weight === "700" ||
    weight === "800" ||
    weight === "900"
      ? BOLD_FONT
      : REGULAR_FONT;

  return <NativeText {...props} style={[style, { fontFamily }]} />;
}
