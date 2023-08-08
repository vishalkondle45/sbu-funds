import { Text } from "@mantine/core";
import React from "react";

const TextM = (props) => {
  return (
    <Text fz="sm" ff="monospace" {...props}>
      {props.children}
    </Text>
  );
};

export default TextM;
