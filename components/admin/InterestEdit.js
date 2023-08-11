import {
  Button,
  Box,
  NumberInput,
  SimpleGrid,
  LoadingOverlay,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function InterestEdit({ id }) {
  const [visible, { open, close }] = useDisclosure(true);
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
  const router = useRouter();

  useEffect(() => {
    const getInterest = async () => {
      open();
      await axios
        .get(`/api/interest?id=${id}`)
        .then((res) => {
          form.setValues(res.data.data);
          close();
        })
        .catch((error) => {
          router.push("/admin/interests");
        });
    };
    if (id) getInterest();
  }, [id]);

  const updateInterest = async (values) => {
    await axios
      .put("/api/interest", values)
      .then(() => {
        notifications.show({
          title: "Interest updated Successfully... 😀",
          icon: <IconCheck size="1.2rem" />,
          color: "green",
        });
      })
      .catch((error) => {
        notifications.show({
          title: "Interest updation failed... 😥",
          message: error.response.data.data,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
      });
  };

  return (
    <Box maw={300} mx="auto">
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <form onSubmit={form.onSubmit((values) => updateInterest(values))}>
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
          <NumberInput
            label="Amount"
            placeholder="Enter Amount"
            withAsterisk
            {...form.getInputProps("interest60")}
            precision={2}
            type="number"
          />
          <Textarea
            label="Comments"
            placeholder="Account No | Cheque No | NEFT | RTGS"
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
