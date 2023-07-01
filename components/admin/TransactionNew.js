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
import { useEffect, useState } from "react";

export default function TransactionNew() {
  const [accountsList, setAccountsList] = useState([]);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      transaction_id: "",
      from: null,
      to: null,
      amount: "",
      transaction_type: "Cash",
      comments: "",
    },
    validate: {
      from: (value, values) =>
        value !== values.to ? null : "Cant be same as To",
      to: (value, values) =>
        value !== values.from ? null : "Cant be same as From",
      amount: (value) => (value != 0 ? null : "Enter valid amount"),
      transaction_type: (value, values) =>
        value == "Cash" || value == "Cheque" || (values.from && values.to)
          ? null
          : "From and To both are mandatory",
    },
  });

  const newTransaction = async (values) => {
    if (values.transaction_type != "Transfer" && values.from && values.to) {
      form.setFieldError(
        "transaction_type",
        "Please select From or To only for this transaction type."
      );
      return null;
    }
    await axios
      .post("/api/transaction", values)
      .then(({ data }) => {
        notifications.show({
          title: "Transaction created Successfully... 😀",
          icon: <IconCheck size="1.2rem" />,
          color: "green",
          message: data.message,
          autoClose: 5000,
        });
        form.reset();
        router.push("/admin/transactions");
      })
      .catch((error) => {
        notifications.show({
          title: "Transaction creation failed... 😥",
          message: error.response.data.data,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
      });
  };

  useEffect(() => {
    const getAccountsList = async () => {
      const { data } = await axios.get(`/api/accounts`);
      setAccountsList(data.data);
      form.setFieldValue("from", "");
      form.setFieldValue("to", "");
    };
    getAccountsList();
  }, []);

  return (
    <Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => newTransaction(values))}>
        <SimpleGrid cols={1}>
          <Select
            withAsterisk={
              form.values.transaction_type === "Transfer" || !form.values.to
            }
            label="From"
            data={accountsList}
            searchable
            clearable
            nothingFound="No Accounts Found"
            placeholder="Select From Account"
            {...form.getInputProps("from")}
          />
          <Select
            withAsterisk={
              form.values.transaction_type === "Transfer" || !form.values.from
            }
            label="To"
            data={accountsList}
            searchable
            clearable
            nothingFound="No Accounts Found"
            placeholder="Select To Account"
            {...form.getInputProps("to")}
          />
          <NumberInput
            label="Amount"
            placeholder="Enter Amount"
            withAsterisk
            {...form.getInputProps("amount")}
            precision={2}
            type="number"
          />
          <Select
            withAsterisk
            label="Transaction Type"
            data={["Cash", "Transfer", "Cheque", "NEFT", "RTGS"]}
            {...form.getInputProps("transaction_type")}
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
