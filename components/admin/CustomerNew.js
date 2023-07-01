import {
  TextInput,
  Button,
  Box,
  PasswordInput,
  Textarea,
  NumberInput,
  Switch,
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";

export default function CustomerNew() {
  const form = useForm({
    initialValues: {
      name: "",
      pan: "",
      dob: "",
      aadhar: "",
      mobile: "",
      email: "",
      password: "",
      address: "",
      nominee: "",
      relation: "",
      shares: 1,
      comments: "",
      isAdmin: false,
    },
    validate: {
      name: (value) => (value.length > 3 ? null : "Enter valid name"),
      pan: (value) => (value.length === 10 ? null : "Enter valid pan"),
      dob: (value) => (value.length === 10 ? null : "DD-MM-YYYY"),
      aadhar: (value) => (value.length === 12 ? null : "Enter valid aadhar"),
      mobile: (value) => (value.length === 10 ? null : "Enter valid mobile"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Enter valid email"),
      password: (value) => (value.length > 7 ? null : "Enter min 8 characters"),
      address: (value) => (value.length > 10 ? null : "Enter valid address"),
      nominee: (value) => (value.length > 3 ? null : "Enter valid nominee"),
      relation: (value) => (value.length > 3 ? null : "Enter valid relation"),
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
        notifications.show({
          title: "Customer creation failed... 😥",
          message: error.response.data.data,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
      });
  };

  return (
    <Box maw={500} mx="auto">
      <form onSubmit={form.onSubmit((values) => newCustomer(values))}>
        <SimpleGrid cols={2}>
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
          <TextInput
            withAsterisk
            label="Date of Birth"
            placeholder="Date of Birth"
            {...form.getInputProps("dob")}
            minLength={10}
            maxLength={10}
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
