import {
  Button,
  Box,
  SimpleGrid,
  Select,
  Textarea,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState, forwardRef } from "react";

export default function TransactionNew() {
  const [customersList, setCustomersList] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [data, setData] = useState([
    "Cash Deposit",
    "Cash Withdrawl",
    "Cheque Deposit",
    "Cheque Withdrawl",
    "Interest Paid to Customer",
    "Interest Paid to Bank",
  ]);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      transaction_id: "",
      customer_id: "",
      account_number: "",
      amount: "",
      transaction_type: "Cash",
      comments: "",
    },
    validate: {
      customer_id: (value) => (value ? null : "Select valid customer"),
      account_number: (value) => (value ? null : "Select account number"),
      amount: (value) => (value != 0 ? null : "Enter valid amount"),
    },
  });

  const newTransaction = async (values) => {
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
    const getCustomersList = async () => {
      const { data } = await axios.get("/api/customers");
      setCustomersList(data.data);
      form.setFieldValue("account_number", "");
    };
    getCustomersList();
  }, []);

  useEffect(() => {
    const getAccountsList = async (customer_id) => {
      const { data } = await axios.get(`/api/accounts?id=${customer_id}`);
      setAccountsList(data.data);
      form.setFieldValue("account_number", "");
    };
    if (form.values.customer_id) {
      getAccountsList(form.values.customer_id);
    }
  }, [form.values.customer_id]);

  return (
    <Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => newTransaction(values))}>
        <SimpleGrid cols={1}>
          <Select
            withAsterisk
            label="Customer"
            data={customersList}
            searchable
            nothingFound="No Customers Found"
            placeholder="Pick one"
            {...form.getInputProps("customer_id")}
          />
          <Select
            withAsterisk
            label="Account"
            data={accountsList}
            searchable
            nothingFound="No Accounts Found"
            placeholder="Pick one"
            {...form.getInputProps("account_number")}
          />
          <NumberInput
            label="Amount"
            placeholder="Amount"
            withAsterisk
            {...form.getInputProps("amount")}
            precision={2}
            type="number"
          />
          <Select
            withAsterisk
            label="Account Type"
            data={["Cash", "Cheque"]}
            {...form.getInputProps("transaction_type")}
          />
          <Select
            label="Comments"
            placeholder="Comments"
            data={data}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setData((current) => [...current, item]);
              return item;
            }}
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
