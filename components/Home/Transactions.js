import React, { useEffect, useMemo, useRef, useState } from "react";
import { MantineReactTable } from "mantine-react-table";
import axios from "axios";
import dayjs from "dayjs";
import { Container, Loader, LoadingOverlay, Select, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
export default function Transsactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [value, setValue] = useState(null);
  const account = useRef("");

  const getTransactions = async () => {
    handlers.open();
    const { data } = await axios.get(
      `/api/myTransactions?account_number=${value}`
    );
    setTransactions(data.data);
    handlers.close();
  };
  useEffect(() => {
    if (value) {
      getTransactions();
      account.current = value;
    }
  }, [value]);

  useEffect(() => {
    const getAccounts = async () => {
      const { data } = await axios.get(`/api/getAccounts`);
      setAccounts(data.data.map((account) => String(account)));
    };
    getAccounts();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "transaction_id",
        header: "Trns. ID",
        size: 50,
      },
      {
        accessorKey: "from",
        header: "From",
        size: 50,
        Cell: ({ cell, row }) => {
          return <Text fw={700}>{cell.getValue()}</Text>;
        },
      },
      {
        accessorKey: "to",
        header: "To",
        size: 50,
        Cell: ({ cell }) => <Text fw={700}>{cell.getValue()}</Text>,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        size: 50,
        Cell: ({ row, cell }) => (
          <Text
            color={account.current == row.original.from ? "red" : "green"}
            fw={700}
          >
            {account.current == row.original.from
              ? "-" + cell.getValue().toFixed(2)
              : "+" + cell.getValue().toFixed(2)}
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
        header: "Balance",
        size: 50,
        Cell: ({ row, cell }) => (
          <Text fw={700}>
            {account.current == row.original.from
              ? row.original.from_balance
              : row.original.to_balance}
          </Text>
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
    ],
    []
  );

  const [visible, handlers] = useDisclosure(false);

  return (
    <Container size={"xl"}>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <Select
        label="Select Account"
        placeholder="Accounts"
        data={accounts}
        value={value}
        onChange={setValue}
        withAsterisk
      />
      <LoadingOverlay
        visible={visible}
        loader={<Loader variant="dots" />}
        overlayBlur={2}
      />
      <MantineReactTable
        columns={columns}
        data={transactions}
        enableRowSelection={false}
        enableColumnOrdering={true}
        enableGlobalFilter={true}
        enableDensityToggle={false}
        initialState={{ density: "xs" }}
        enableColumnDragging={false}
        enableStickyHeader
        mantineTableContainerProps={{ sx: { maxHeight: "500px" } }}
      />
    </Container>
  );
}
