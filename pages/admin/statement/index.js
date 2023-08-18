import HeaderComponent from "@/components/admin/Header";
import { Button, Box, SimpleGrid, NumberInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

export default function TransactionNew() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      from: null,
      to: null,
      account_number: "",
    },
    validate: {
      from: (value, values) =>
        value !== values.to ? null : "Cant be same as To",
      to: (value, values) =>
        value !== values.from ? null : "Cant be same as From",
      account_number: (value) => (value ? null : "Enter valid account_number"),
    },
  });

  const getStatement = async (values) => {
    router.push(
      `/admin/statement/${values.account_number}?from=${values.from}&to=${values.to}`
    );
  };

  return (
    <>
      <HeaderComponent />
      <Box maw={300} mx="auto">
        <form onSubmit={form.onSubmit((values) => getStatement(values))}>
          <SimpleGrid cols={1}>
            <DatePickerInput
              label="From"
              placeholder="Select From Date"
              {...form.getInputProps("from")}
            />
            <DatePickerInput
              label="To"
              placeholder="Select To Date"
              {...form.getInputProps("to")}
            />
            <NumberInput
              label="account_number"
              placeholder="Enter account_number"
              withAsterisk
              {...form.getInputProps("account_number")}
              type="number"
            />
            <Button type="submit" color="dark">
              Submit
            </Button>
          </SimpleGrid>
        </form>
      </Box>
    </>
  );
}
