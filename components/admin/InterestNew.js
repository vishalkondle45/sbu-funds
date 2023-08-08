import {
  Button,
  Box,
  SimpleGrid,
  Select,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";

export default function InterestNew() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      from_days: 1,
      to_days: 0,
      interest: 0,
      comments: "",
    },
    validate: {
      from_days: (value, values) =>
        value !== values.to_days ? null : "Cant be same as To Days",
      to_days: (value, values) =>
        value !== values.from_days ? null : "Cant be same as From Days",
      interest: (value) => (value != 0 ? null : "Enter valid interest"),
    },
  });

  const newInterest = async (values) => {
    await axios
      .post("/api/interest", values)
      .then(({ data }) => {
        notifications.show({
          title: "Interest created Successfully... 😀",
          icon: <IconCheck size="1.2rem" />,
          color: "green",
          message: data.message,
          autoClose: 5000,
        });
        form.reset();
        router.push("/admin/interests");
      })
      .catch((error) => {
        notifications.show({
          title: "Interest creation failed... 😥",
          message: error.response.data.message,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
      });
  };

  return (
    <Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => newInterest(values))}>
        <SimpleGrid cols={1}>
          <NumberInput
            label="From Days"
            placeholder="Enter From Days"
            withAsterisk
            {...form.getInputProps("from_days")}
            type="number"
          />
          <NumberInput
            label="To Days"
            placeholder="Enter To Days"
            withAsterisk
            {...form.getInputProps("to_days")}
            type="number"
          />
          <NumberInput
            label="Amount"
            placeholder="Enter Amount"
            withAsterisk
            {...form.getInputProps("interest")}
            precision={2}
            type="number"
          />
          <Textarea
            label="Comments"
            placeholder="Comments"
            {...form.getInputProps("comments")}
          />
          <Button type="submit" color="dark">
            Submit
          </Button>
        </SimpleGrid>
      </form>
    </Box>
  );
}
