import React, { useState } from "react";
import { StyleSheet } from "react-native";

const colorsOptions = {
  dottoreLightBlue: "#D7EFEE",
  dottoreDarkBlue: "#356791",
  light: "#FFFFFF",
  dark: "#161E2A",
  white: "#FFFFFF",
  black: "#000000",
};

export const ThemeContext = React.createContext({});

export const lightTheme = {
  colors: {
    background: colorsOptions.light,
    normal: colorsOptions.dottoreDarkBlue,
  },
  text: {
    header: {
      fontSize: 24,
    },
  },
};

export const darkTheme = {
  colors: {
    background: colorsOptions.dark,
    normal: colorsOptions.dottoreLightBlue,
  },
  text: {
    header: {
      fontSize: 24,
    }
  }
}

