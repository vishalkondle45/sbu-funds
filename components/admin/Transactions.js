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
  rem,
} from "@mantine/core";
import { useRouter } from "next/router";
import { IconCirclePlus, IconDownload, IconUpload } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import * as XLSX from "xlsx";

export default function Transsactions() {
  const router = useRouter();
  const [value, setValue] = useState(null);
  const [data, setData] = useState([]);
  const getTransactions = async (filters) => {
    handlers.open();
    const { data } = await axios.post(`/api/transactions`, {
      filters,
    });
    setData(data.data);
    handlers.close();
  };
  useEffect(() => {
    getTransactions(router.query);
  }, [router.query]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "transaction_id",
        header: "Transaction ID",
        size: 50,
      },
      {
        accessorKey: "from",
        header: "From",
        size: 50,
        Cell: ({ cell }) => (
          <Text
            fw={700}
            // onMouseEnter={() => getCustomer(cell.getValue())}
          >
            {cell.getValue()}
          </Text>
        ),
      },
      {
        accessorKey: "to",
        header: "To",
        size: 50,
        Cell: ({ cell }) => (
          <Text
            fw={700}
            // onMouseEnter={() => getCustomer(cell.getValue())}
          >
            {cell.getValue()}
          </Text>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        size: 50,
        Cell: ({ row, cell }) => (
          <Text
            color={
              (!row.original.to && "red") || (!row.original.from && "green")
            }
            fw={700}
          >
            {cell.getValue().toFixed(2)}
          </Text>
        ),
      },
      {
        accessorKey: "transaction_type",
        header: "Type",
        size: 50,
      },
      {
        accessorKey: "from_balance",
        header: "From Balance",
        size: 50,
        Cell: ({ cell }) => (
          <Text fw={700}>{cell.getValue()?.toFixed(2) || "-"}</Text>
        ),
      },
      {
        accessorKey: "to_balance",
        header: "To Balance",
        size: 50,
        Cell: ({ cell }) => (
          <Text fw={700}>{cell.getValue()?.toFixed(2) || "-"}</Text>
        ),
      },
      {
        accessorKey: "comments",
        header: "Comments",
        size: 50,
      },
      {
        accessorKey: "createdAt",
        header: "Date & Time",
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY HH:mm A"),
        size: 50,
      },
      // {
      //   accessorKey: "Updated At",
      //   header: "updatedAt",
      //   Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
      //   size: 50,
      // },
    ],
    []
  );

  const deleteTransaction = async (id) => {
    handlers.open();
    await axios.delete(`/api/transaction?id=${id}`);
    getTransactions();
  };

  const openModal = (id) =>
    modals.openConfirmModal({
      title: `Do you really want to delete - ${id} ?`,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deleteTransaction(id),
    });
  const [visible, handlers] = useDisclosure(false);

  const excelToJson = (file) => {
    if (file) {
      return new Promise((resolve, reject) => {
        const xlsx = require("xlsx");
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = xlsx.utils.sheet_to_json(worksheet);
          resolve(json);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }
  };

  const handleImport = async () => {
    let JsonData = await excelToJson(value);
    axios
      .put("/api/import?table=transactions", JsonData)
      .then((response) => {
        notifications.show({
          message: response.data.message,
          icon: <IconCheck />,
          color: "green",
          title: "Accounts updated successfully ✌️",
        });
        console.log(response.data);
        setValue(null);
        getAccounts();
      })
      .catch((error) => {
        console.log(error);
        notifications.show({
          message: error.response.data.message,
          icon: <IconX />,
          color: "red",
          title: "Accounts updation failed ☹️",
        });
      });
  };

  useEffect(() => {
    if (value) {
      handleImport();
    }
  }, [value]);

  const handleExport = () => {
    const newData = data.map(
      ({ _id, createdAt, updatedAt, __v, name, ...rest }) => {
        return rest;
      }
    );
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(newData);
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(
      wb,
      `Transactions - ${dayjs().format("DD-MM-YYYY HH:mm:ss")}.xlsx`
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
        enableColumnDragging={false}
        renderTopToolbarCustomActions={() => (
          <Group>
            <Button
              variant="filled"
              color="red"
              onClick={() => router.push("/admin/transactions/new")}
              leftIcon={<IconCirclePlus />}
            >
              New Transaction
            </Button>
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
        )}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <Menu.Item
            onClick={() =>
              router.push(
                `/admin/transactions/edit/${row.original.transaction_id}`
              )
            }
          >
            Edit
          </Menu.Item>,
          <Menu.Item onClick={() => openModal(row.original.transaction_id)}>
            Delete
          </Menu.Item>,
        ]}
      />
    </Container>
  );
}
