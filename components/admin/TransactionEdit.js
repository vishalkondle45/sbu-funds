import {
  TextInput,
  Button,
  Box,
  PasswordInput,
  Textarea,
  NumberInput,
  SimpleGrid,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TransactionNew({ id }) {
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
  const [visible, { toggle }] = useDisclosure(true);
  const form = useForm({
    initialValues: {
      transaction_id: "",
      customer_id: "",
      account_number: "",
      amount: 0,
      transaction_type: "Cash",
      comments: "",
    },
    validate: {
      customer_id: (value) => (value ? null : "Select valid customer"),
      account_number: (value) => (value ? null : "Select account number"),
      amount: (value) => (value != 0 ? null : "Enter valid amount"),
    },
  });
  const router = useRouter();

  useEffect(() => {
    const getTransaction = async () => {
      const { data: data1 } = await axios.get(`/api/transaction?id=${id}`);
      if (!data1.data) {
        notifications.show({
          title: `No transaction with id - ${id} ... 😥`,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
        router.push("/admin/transactions");
      } else {
        form.setValues(data1.data);
        setData((data) => {
          return [...data, data1.data.comments];
        });
      }
    };
    const getCustomersList = async () => {
      const { data } = await axios.get("/api/customers");
      setCustomersList(data.data);
      toggle();
      // form.setFieldValue("account_number", "");
    };
    if (id) getTransaction();
    getCustomersList();
  }, [id]);

  useEffect(() => {
    const getAccountsList = async (customer_id) => {
      const { data } = await axios.get(`/api/accounts?id=${customer_id}`);
      setAccountsList(data.data);
      // form.setFieldValue("account_number", "");
    };
    if (form.values.customer_id) {
      getAccountsList(form.values.customer_id);
    }
  }, [form.values.customer_id]);

  const updateTransaction = async (values) => {
    await axios
      .put("/api/transaction", values)
      .then(() => {
        notifications.show({
          title: "Transaction updated Successfully... 😀",
          icon: <IconCheck size="1.2rem" />,
          color: "green",
        });
      })
      .catch((error) => {
        notifications.show({
          title: "Transaction updation failed... 😥",
          message: error.response.data.data,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
      });
  };

  return (
    <Box maw={300} mx="auto">
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <form onSubmit={form.onSubmit((values) => updateTransaction(values))}>
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
            precision={2}
            withAsterisk
            type="number"
            {...form.getInputProps("amount")}
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
