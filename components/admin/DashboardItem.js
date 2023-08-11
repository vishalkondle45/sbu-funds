import { Loader, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import React from "react";

const DashboardItem = ({ title, count }) => {
  const theme = useMantineTheme();
  return (
    <Paper
      shadow="xl"
      p="md"
      mx="xs"
      // style={{ backgroundColor: "#FA5252" }}
      bg={theme.primaryColor}
      withBorder
    >
      <Title order={3} color="white" italic>
        {title}
      </Title>
      <Title order={1} align="right" color="white">
        {count !== undefined ? count : <Loader color="white" variant="dots" />}
      </Title>
    </Paper>
  );
};

export default DashboardItem;
