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

export default function Interests() {
  const router = useRouter();
  const [value, setValue] = useState(null);
  const [data, setData] = useState([]);
  const getInterests = async () => {
    handlers.open();
    const { data } = await axios.get(`/api/interest`);
    setData(data.data);
    handlers.close();
  };
  useEffect(() => {
    getInterests();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "from_days",
        header: "From Days",
      },
      {
        accessorKey: "to_days",
        header: "To Days",
      },
      {
        accessorKey: "interest",
        header: "Interest",
        Cell: ({ cell }) => <Text fw={700}>{cell.getValue()}%</Text>,
      },
      {
        accessorKey: "interest60",
        header: "Interest for Senior Citizens",
        Cell: ({ cell }) => <Text fw={700}>{cell.getValue()}%</Text>,
      },
      {
        accessorKey: "createdAt",
        header: "Date & Time",
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY HH:MM"),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY HH:MM"),
      },
    ],
    []
  );

  const deleteInterest = async (id) => {
    handlers.open();
    await axios.delete(`/api/interest?id=${id}`);
    getInterests();
  };

  const openModal = (id) =>
    modals.openConfirmModal({
      title: `Do you really want to delete - ${id} ?`,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deleteInterest(id),
    });
  const [visible, handlers] = useDisclosure(false);

  const handleExport = () => {
    const newData = data.map(
      ({ _id, createdAt, updatedAt, __v, name, ...rest }) => {
        return rest;
      }
    );
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(newData);
    XLSX.utils.book_append_sheet(wb, ws, "Interests");
    XLSX.writeFile(
      wb,
      `Interests - ${dayjs().format("DD-MM-YYYY HH:mm:ss")}.xlsx`
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
              // color="red"
              onClick={() => router.push("/admin/interests/new")}
              leftIcon={<IconCirclePlus />}
            >
              New Interest
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
              router.push(`/admin/interests/edit/${row.original.id}`)
            }
          >
            Edit
          </Menu.Item>,
          <Menu.Item onClick={() => openModal(row.original.id)}>
            Delete
          </Menu.Item>,
        ]}
      />
    </Container>
  );
}
