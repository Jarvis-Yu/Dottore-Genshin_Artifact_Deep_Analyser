import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function styles({ style="day" }) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[style].color_1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}

const colors = {
  day: {
    color_1: "#FFFFFF",
    color_2: "#333333",
  },
  night: {
    color_1: "#333333",
    color_2: "#FFFFFF",
  },
};
