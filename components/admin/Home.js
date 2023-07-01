import {
  RingProgress,
  Text,
  SimpleGrid,
  Paper,
  Center,
  Group,
  Container,
} from "@mantine/core";
import { IconCalendar, IconCurrencyRupee } from "@tabler/icons-react";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconUsersGroup,
  IconPigMoney,
  IconReportMoney,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const icons = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
  customers: IconUsersGroup,
  accounts: IconPigMoney,
  transactions: IconReportMoney,
  calendar: IconCalendar,
  CurrencyRupee: IconCurrencyRupee,
};

export default function Home() {
  const [data, setData] = useState([]);
  const router = useRouter();
  useEffect(() => {
    // const getHome = async () => {
    //   await axios.get("/api/home").then((response) => {
    //     setData(response.data.data);
    //   });
    // };
    // getHome();
  }, []);
  const stats = data?.map((stat) => {
    const Icon = icons[stat.icon];
    return (
      <Paper
        withBorder
        shadow="xl"
        radius="md"
        p="xs"
        key={stat.label}
        bg={stat.color}
      >
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: 100, color: "white" }]}
            label={
              <Center>
                <Icon size={"2rem"} stroke={2.5} />
              </Center>
            }
          />

          <div>
            <Text color="dark" size="xs" transform="uppercase" weight={700}>
              {stat.label}
            </Text>
            <Text weight={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return (
    <Container size={"xl"}>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "xs", cols: 1 },
          { maxWidth: "sm", cols: 2 },
          { maxWidth: "md", cols: 3 },
          { maxWidth: "lg", cols: 4 },
        ]}
      >
        {stats}
      </SimpleGrid>
    </Container>
  );
}
