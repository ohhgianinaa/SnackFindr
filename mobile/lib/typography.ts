import { TextStyle } from "react-native";

const bold: TextStyle = { fontFamily: "DMSans_700Bold", color: "#1a1a1a" };
const reg:  TextStyle = { fontFamily: "DMSans_400Regular", color: "#1a1a1a" };

export const type = {
  h1:       { ...bold, fontSize: 32, lineHeight: 38, letterSpacing: -0.5 } as TextStyle,
  h2:       { ...bold, fontSize: 24, lineHeight: 30, letterSpacing: -0.5 } as TextStyle,
  h3:       { ...bold, fontSize: 20, lineHeight: 26, letterSpacing: -0.5 } as TextStyle,
  h4:       { ...bold, fontSize: 16, lineHeight: 22, letterSpacing: -0.5 } as TextStyle,
  body:     { ...reg,  fontSize: 16, lineHeight: 22, letterSpacing: 0    } as TextStyle,
  metadata: { ...reg,  fontSize: 14, lineHeight: 18, color: "#8e8e93"    } as TextStyle,
  tag:      { ...bold, fontSize: 14, lineHeight: 18, letterSpacing: 0.5,
              textTransform: "uppercase"                                  } as TextStyle,
} as const;
