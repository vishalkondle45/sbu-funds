import { Text } from "@mantine/core";
import React from "react";

const TextMB = (props) => {
  return (
    <Text fw={700} ff="Times New Roman" {...props}>
      {props.children}
    </Text>
  );
};

export default TextMB;
