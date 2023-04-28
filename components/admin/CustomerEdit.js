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

export default function CustomerNew({ id }) {
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
  const router = useRouter();

  useEffect(() => {
    const getCustomer = async () => {
      const { data } = await axios.get(`/api/customer?id=${id}`);
      if (!data.data) {
        notifications.show({
          title: `No customer with id - ${id} ... 😥`,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
        router.push("/admin/customers");
      } else {
        form.setValues(data.data);
        form.setFieldValue("isAdmin", Boolean(data.data.isAdmin));
      }
    };
    if (id) getCustomer();
  }, [id]);

  const updateCustomer = async (values) => {
    await axios
      .put("/api/customer", values)
      .then(() => {
        notifications.show({
          title: "Customer updated Successfully... 😀",
          icon: <IconCheck size="1.2rem" />,
          color: "green",
        });
      })
      .catch((error) => {
        notifications.show({
          title: "Customer updation failed... 😥",
          message: error.response.data.data,
          icon: <IconX size="1.2rem" />,
          color: "red",
        });
      });
  };

  return (
    <Box maw={500} mx="auto">
      <form onSubmit={form.onSubmit((values) => updateCustomer(values))}>
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
            withAsterisk
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
            minLength={10}
            maxLength={10}
            {...form.getInputProps("mobile")}
          />
          <NumberInput
            withAsterisk
            label="Shares"
            placeholder="Shares"
            {...form.getInputProps("shares")}
            min={1}
          />
          <Select
            withAsterisk
            label="Role"
            data={[
              { value: false, label: "Customer" },
              { value: true, label: "Admin" },
            ]}
            {...form.getInputProps("isAdmin")}
          />
          <Button type="submit" color="dark" my={"lg"}>
            Submit
          </Button>
        </SimpleGrid>
      </form>
    </Box>
  );
}
