import {
  Button,
  Box,
  SimpleGrid,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AccountNew() {
  const [customersList, setCustomersList] = useState([]);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      customer_id: "",
      account_type: "Savings Account",
      comments: "",
      account_number: "",
      duration: null,
    },
    validate: {
      customer_id: (value) => (value ? null : "Select Customer"),
      account_type: (value) => (value ? null : "Select Account Type"),
      duration: (value, values) => {
        if (
          values.account_type === "Fixed Deposit" ||
          values.account_type === "Recurring Deposit"
        ) {
          if (!value) return "Please enter duration";
          return null;
        } else return null;
      },
    },
  });

  const newAccount = async (values) => {
    await axios
      .post("/api/account", values)
      .then(({ data }) => {
        notifications.show({
          title: "Account created Successfully... 😀",
          icon: <IconCheck size="1.2rem" />,
          color: "green",
          message: data.message,
          autoClose: 5000,
        });
        form.reset();
        router.push("/admin/accounts");
      })
      .catch((error) => {
        notifications.show({
          title: "Account creation failed... 😥",
          message: error.response.data.data,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
      });
  };

  useEffect(() => {
    const getCustomersList = async () => {
      await axios
        .get("/api/customers")
        .then(({ data }) => {
          setCustomersList(data.data);
        })
        .catch((error) => {
          console.log(error);
          router.push("/login");
        });
    };
    getCustomersList();
  }, []);

  useEffect(() => {
    if (
      form.values.account_type === "Fixed Deposit" ||
      form.values.account_type === "Recurring Deposit"
    ) {
      form.setFieldValue("duration", 365);
    } else {
      form.setFieldValue("duration", null);
    }
  }, [form.values.account_type]);

  return (
    <Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => newAccount(values))}>
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
            label="Account Type"
            data={[
              "Savings Account",
              "Loan Account",
              "Fixed Deposit",
              "Recurring Deposit",
            ]}
            {...form.getInputProps("account_type")}
          />
          {(form.values.account_type === "Fixed Deposit" ||
            form.values.account_type === "Recurring Deposit") && (
            <>
              <TextInput
                withAsterisk
                label="Duration ( In Days )"
                type="number"
                placeholder="Duration"
                step={5}
                {...form.getInputProps("duration")}
              />
            </>
          )}
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
      {/* {JSON.stringify(form.values)} */}
    </Box>
  );
}
