import React, { useState } from "react";
import { StyleSheet } from "react-native";
import languages from "../language/languages";

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
  text: {
    fontSize: 14,
  }
};

export const lightTheme = {
  colors: {
    background: colorsOptions.light,
    bar: colorsOptions.dottoreDarkBlue,
    notSelected: colorsOptions.dottoreMediumBlue,
    selected: colorsOptions.dottoreDarkBlue,
    notActivated: colorsOptions.dottoreLightBlue,
    activated: colorsOptions.dottoreMediumBlue,
    pressed: colorsOptions.dottoreDarkBlue,
    text: colorsOptions.black,
    textContrast: colorsOptions.white,
  },
  statusBarStyle: "light",
  text,
};

export const darkTheme = {
  colors: {
    background: colorsOptions.dark,
    bar: colorsOptions.dottoreLightBlue,
    notSelected: colorsOptions.dottoreMediumBlue,
    selected: colorsOptions.dottoreLightBlue,
    notActivated: colorsOptions.dottoreDarkBlue,
    activated: colorsOptions.dottoreMediumBlue,
    pressed: colorsOptions.dottoreLightBlue,
    text: colorsOptions.white,
    textContrast: colorsOptions.black,
  },
  statusBarStyle: "dark",
  text,
};
