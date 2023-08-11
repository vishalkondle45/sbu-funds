import React, { useEffect, useMemo, useState } from "react";
import { MantineReactTable } from "mantine-react-table";
import axios from "axios";
import dayjs from "dayjs";
import {
  Button,
  Container,
  FileInput,
  Group,
  LoadingOverlay,
  Menu,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useRouter } from "next/router";
import {
  IconCheck,
  IconCirclePlus,
  IconDownload,
  IconX,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import * as XLSX from "xlsx";
import { IconUpload } from "@tabler/icons-react";

export default function Customers() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [value, setValue] = useState(null);

  const getCustomers = async () => {
    handlers.open();
    const { data } = await axios.post(`/api/customers`, {
      filters: router.query,
    });
    setData(data.data);
    handlers.close();
  };
  useEffect(() => {
    if (router.query) getCustomers();
  }, [router.query]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 50,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 50,
      },
      {
        accessorKey: "pan",
        header: "Pan",
        size: 50,
      },
      {
        accessorKey: "dob",
        header: "DOB",
        size: 50,
        Cell: ({ cell }) => (
          <Text>{dayjs(cell.getValue()).format("DD/MM/YYYY")}</Text>
        ),
      },
      {
        accessorKey: "aadhar",
        header: "Aadhar",
        size: 50,
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
        size: 50,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 50,
      },
      {
        accessorKey: "password",
        header: "Password",
        size: 50,
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 50,
      },
      {
        accessorKey: "nominee",
        header: "Nominee",
        size: 50,
      },
      {
        accessorKey: "relation",
        header: "Relation",
        size: 50,
      },
      {
        accessorKey: "shares",
        header: "Shares",
        size: 50,
      },
      {
        accessorKey: "comments",
        header: "Comments",
        size: 50,
      },
      {
        accessorKey: "isAdmin",
        header: "Admin",
        size: 50,
        // Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        Cell: ({ cell }) => (
          <ThemeIcon
            radius="xl"
            size="sm"
            color={cell.getValue() ? "green" : "red"}
          >
            {cell.getValue() ? <IconCheck /> : <IconX />}
          </ThemeIcon>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created On",
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
        size: 50,
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
        size: 50,
      },
    ],
    []
  );

  const deleteCustomer = async (id) => {
    handlers.open();
    await axios.delete(`/api/customer?id=${id}`);
    getCustomers();
  };

  const openModal = (name, id) =>
    modals.openConfirmModal({
      title: `Do you really want to delete - ${name} ?`,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deleteCustomer(id),
    });
  const [visible, handlers] = useDisclosure(true);

  const handleExport = () => {
    const newData = data.map(
      ({ _id, createdAt, isAdmin, updatedAt, __v, ...rest }) => {
        return rest;
      }
    );
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(newData);
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(
      wb,
      `Customers - ${dayjs().format("DD-MM-YYYY HH:mm:ss")}.xlsx`
    );
  };

  return (
    <Container size={"xl"}>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <MantineReactTable
        columns={columns}
        data={data}
        enableRowSelection={false}
        enableColumnOrdering={true}
        enableGlobalFilter={true}
        enableDensityToggle={false}
        initialState={{ density: "xs" }}
        renderTopToolbarCustomActions={() => (
          <>
            <Group>
              <Button
                variant="filled"
                // color="red"
                onClick={() => router.push("/admin/customers/new")}
                leftIcon={<IconCirclePlus />}
              >
                New Customer
              </Button>
              {/* <Button
                variant="filled"
                color="dark"
                onClick={handleImport}
                leftIcon={<IconTableImport />}
              >
                Import
              </Button> */}
              <FileInput
                placeholder="Import"
                value={value}
                onChange={setValue}
                icon={<IconUpload size={rem(14)} />}
                component="button"
              />
              <Button
                variant="outline"
                color="dark"
                onClick={handleExport}
                leftIcon={<IconDownload />}
              >
                Export
              </Button>
            </Group>
          </>
        )}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <Menu.Item
            onClick={() =>
              router.push(`/admin/customers/edit/${row.original.id}`)
            }
          >
            Edit
          </Menu.Item>,
          <Menu.Item
            onClick={() => openModal(row.original.name, row.original.id)}
          >
            Delete
          </Menu.Item>,
          <Menu.Item
            onClick={() =>
              router.push(`/admin/certificate/shares/${row.original.id}`)
            }
          >
            Certificate
          </Menu.Item>,
        ]}
      />
    </Container>
  );
}
