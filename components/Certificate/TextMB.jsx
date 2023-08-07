import { Text } from "@mantine/core";
import React from "react";

const TextMB = ({ children }) => {
  return (
    <Text fw={700} ff="monospace">
      {children}
    </Text>
  );
};

export default TextMB;
