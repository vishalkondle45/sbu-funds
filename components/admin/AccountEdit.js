import {
  TextInput,
  Button,
  Box,
  PasswordInput,
  Textarea,
  NumberInput,
  SimpleGrid,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AccountNew({ id }) {
  const form = useForm({
    initialValues: {
      customer_id: "",
      account_type: "Savings Account",
      comments: "",
      account_number: "",
    },
    validate: {
      customer_id: (value) => (value ? null : "Select Customer"),
      account_type: (value) => (value ? null : "Select Account Type"),
    },
  });
  const router = useRouter();

  useEffect(() => {
    const getAccount = async () => {
      await axios
        .get(`/api/account?id=${id}`)
        .then(({ data }) => {
          if (!data.data) {
            notifications.show({
              title: `No account with id - ${id} ... 😥`,
              icon: <IconX size="1.2rem" />,
              color: "red",
            });
            router.push("/admin/accounts");
          } else {
            form.setValues(data.data);
          }
        })
        .catch((error) => {
          router.push("/login");
        });
    };
    if (id) getAccount();
  }, [id]);

  const updateAccount = async (values) => {
    await axios
      .put("/api/account", values)
      .then(() => {
        notifications.show({
          title: "Account updated Successfully... 😀",
          icon: <IconCheck size="1.2rem" />,
          color: "green",
        });
        router.push("/admin/accounts");
      })
      .catch((error) => {
        notifications.show({
          title: "Account updation failed... 😥",
          message: error.response.data.data,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
      });
  };

  return (
    <Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => updateAccount(values))}>
        <SimpleGrid cols={1}>
          <Select
            withAsterisk
            label="Account Type"
            data={[
              "Savings Account",
              "Loan Account",
              "Fixed Deposit",
              "Recurring Deposit",
            ]}
            {...form.getInputProps("account_type")}
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
