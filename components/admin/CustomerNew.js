import {
  TextInput,
  Button,
  Box,
  PasswordInput,
  Textarea,
  NumberInput,
  Switch,
  SimpleGrid,
  Radio,
  Group,
  Select,
  Container,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";

export default function CustomerNew() {
  const form = useForm({
    initialValues: {
      name: "",
      address: "",
      pan: "",
      aadhar: "",
      email: "",
      mobile: "",
      dob: null,
      gender: "Male",
      occupation: "",
      income: "",
      nominee: "",
      relation: "",
      nominee_dob: null,
      mother: "",
      category: "",
      shares: 1,
      password: "",
      comments: "",
      isAdmin: false,
    },
    validate: {
      // name: (value) => (value ? null : "Enter valid name"),
      // address: (value) => (value ? null : "Enter valid address"),
      // pan: (value) => (value.length === 10 ? null : "Enter valid pan"),
      // aadhar: (value) => (value.length === 12 ? null : "Enter valid aadhar"),
      // email: (value) => (/^\S+@\S+$/.test(value) ? null : "Enter valid email"),
      // mobile: (value) => (value.length === 10 ? null : "Enter valid mobile"),
      // dob: (value) => (value ? null : "Please select DOB"),
      // gender: (value) => (value ? null : "Please select Gender"),
      // occupation: (value) => (value ? null : "Please select Occupation"),
      // income: (value) => (value ? null : "Please select Income"),
      // nominee: (value) => (value ? null : "Please select Nominee"),
      // relation: (value) => (value ? null : "Enter valid relation"),
      // // nominee_dob: (value) => (value ? null : "Enter valid Nominee DOB"),
      // mother: (value) => (value ? null : "Enter valid mother"),
      // catogry: (value) => (value ? null : "Enter valid catogry"),
      // shares: (value) => (value ? null : "Enter valid Shares"),
      // password: (value) => (value ? null : "Enter valid password"),
    },
  });

  const newCustomer = async (values) => {
    await axios
      .post("/api/customer", values)
      .then(() => {
        notifications.show({
          title: "Customer created Successfully... 😀",
          icon: <IconCheck size="1.2rem" />,
          color: "green",
        });
        router.push("/admin/customers");
      })
      .catch((error) => {
        console.log(error);
        notifications.show({
          title: "Customer creation failed... 😥",
          message: error.response.data.message,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
      });
  };

  return (
    <Box maw={900} mx="auto">
      <form onSubmit={form.onSubmit((values) => newCustomer(values))}>
        <SimpleGrid cols={3}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Full Name"
            {...form.getInputProps("name")}
          />
          <TextInput
            withAsterisk
            label="PAN"
            placeholder="Pan Number"
            {...form.getInputProps("pan")}
            minLength={10}
            maxLength={10}
          />
          <DatePickerInput
            withAsterisk
            label="Date of Birth"
            placeholder="Date of Birth"
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("dob")}
          />
          <TextInput
            withAsterisk
            label="Aadhar"
            placeholder="Aadhar Number"
            {...form.getInputProps("aadhar")}
            minLength={12}
            maxLength={12}
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="Email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Password"
            {...form.getInputProps("password")}
          />
          <Radio.Group
            label="Gender"
            withAsterisk
            {...form.getInputProps("gender")}
          >
            <Group mt="xs">
              <Radio value="Male" label="Male" />
              <Radio value="Female" label="Female" />
            </Group>
          </Radio.Group>
          <Select
            withAsterisk
            label="Category"
            placeholder="Category"
            data={[
              "Savings Account",
              "Loan Account",
              "Fixed Deposit",
              "Recurring Deposit",
              "Others",
            ]}
            {...form.getInputProps("category")}
          />
          <TextInput
            withAsterisk
            label="Occupation"
            placeholder="Occupation"
            {...form.getInputProps("occupation")}
          />
          <TextInput
            withAsterisk
            label="Income"
            placeholder="Income"
            {...form.getInputProps("income")}
          />
          <Textarea
            withAsterisk
            label="Address"
            placeholder="Address"
            {...form.getInputProps("address")}
          />
          <Textarea
            label="Comments"
            placeholder="Comments"
            {...form.getInputProps("comments")}
          />
          <TextInput
            withAsterisk
            label="Nominee"
            placeholder="Nominee"
            {...form.getInputProps("nominee")}
          />
          <TextInput
            withAsterisk
            label="Relation"
            placeholder="Relation"
            {...form.getInputProps("relation")}
          />
          <DatePickerInput
            withAsterisk
            label="Nominee DOB"
            placeholder="Nominee DOB"
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("nominee_dob")}
          />
          <TextInput
            withAsterisk
            label="Mother"
            placeholder="Mother"
            {...form.getInputProps("mother")}
          />
          <TextInput
            withAsterisk
            label="Mobile Number"
            placeholder="Mobile"
            {...form.getInputProps("mobile")}
            minLength={10}
            maxLength={10}
          />
          <NumberInput
            withAsterisk
            label="Shares"
            placeholder="Shares"
            {...form.getInputProps("shares")}
            min={1}
          />
          <Switch
            size={"lg"}
            label="isAdmin"
            {...form.getInputProps("isAdmin")}
            onLabel="Yes"
            offLabel="No"
          />
          <Button type="submit" color="dark">
            Submit
          </Button>
        </SimpleGrid>
      </form>
    </Box>
  );
}
