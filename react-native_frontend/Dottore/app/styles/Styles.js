import React, { useState } from "react";
import { StyleSheet } from "react-native";

const colorsOptions = {
  dottoreLightBlue: "#D7EFEE",
  dottoreMediumBlue: "#90b6b3",
  dottoreDarkBlue: "#356791",
  light: "#EEEEEE",
  dark: "#161E2A",
  white: "#FFFFFF",
  black: "#000000",
};

export const ThemeContext = React.createContext({});

const text = {
  header: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
  },
  content: {
    fontSize: 16,
  },
};

export const lightTheme = {
  colors: {
    background: colorsOptions.light,
    normal: colorsOptions.dottoreDarkBlue,
    notSelected: colorsOptions.dottoreMediumBlue,
    selected: colorsOptions.dottoreDarkBlue,
    text: colorsOptions.black,
    textContrast: colorsOptions.white,
  },
  text,
};

export const darkTheme = {
  colors: {
    background: colorsOptions.dark,
    normal: colorsOptions.dottoreLightBlue,
    notSelected: colorsOptions.dottoreMediumBlue,
    selected: colorsOptions.dottoreLightBlue,
    text: colorsOptions.white,
    textContrast: colorsOptions.black,
  },
  text,
};
