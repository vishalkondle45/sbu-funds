import React, { useEffect, useState } from "react";
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
  rem,
} from "@mantine/core";
import { useRouter } from "next/router";
import { IconCirclePlus, IconDownload, IconUpload } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import * as XLSX from "xlsx";
import { ToWords } from "to-words";
import jsPDF from "jspdf";
import { PDFObject } from "react-pdfobject";

export default function Accounts() {
  const router = useRouter();
  const [value, setValue] = useState(null);
  const [data, setData] = useState([]);
  const getAccounts = async () => {
    handlers.open();
    const { data } = await axios.post(`/api/accounts`, {
      filters: router.query,
    });
    setData(data.data);
    handlers.close();
  };
  useEffect(() => {
    if (router.query) getAccounts();
  }, [router.query]);

  const columns = [
    {
      accessorKey: "account_number",
      header: "Acc No.",
      size: 50,
    },
    {
      accessorKey: "name",
      header: "Customer Name",
      size: 50,
    },
    {
      accessorKey: "account_type",
      header: "Acc. Type",
      size: 50,
    },
    {
      accessorKey: "comments",
      header: "Comments",
      size: 50,
    },
    {
      accessorKey: "Created At",
      header: "createdAt",
      Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
      size: 50,
    },
    {
      accessorKey: "Updated At",
      header: "updatedAt",
      Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
      size: 50,
    },
  ];

  const deleteAccount = async (id) => {
    handlers.open();
    await axios.delete(`/api/account?id=${id}`);
    getAccounts();
  };

  const openModal = (id) =>
    modals.openConfirmModal({
      title: `Do you really want to delete - ${id} ?`,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deleteAccount(id),
    });
  const [visible, handlers] = useDisclosure(true);

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
    console.log(JsonData);
    axios
      .put("/api/import?table=accounts", JsonData)
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
    XLSX.utils.book_append_sheet(wb, ws, "Accounts");
    XLSX.writeFile(
      wb,
      `Accounts - ${dayjs().format("DD-MM-YYYY HH:mm:ss")}.xlsx`
    );
  };
  let [url, setUrl] = useState(null);
  const getCertificate = (account_number) => {
    const toWords = new ToWords();
    var doc = new jsPDF("l", "mm", "a4");

    doc.addImage(process.env.LOGO_BASE64, "PNG", 5, 2, 40, 20);
    doc
      .setFontSize(40)
      .setFont("Times New Roman", "bold")
      .text(50, 16, "SBU MUTUAL BENEFIT FUNDS");
    doc
      .setFontSize(40)
      .setFont("Times New Roman", "bold")
      .text(100, 28, "NIDHI LIMITED");
    doc
      .setFontSize(15)
      .setFont("Times New Roman", "bold")
      .text(100, 35, "Registration No - U64990PN2023PLN219751");
    doc
      .setFontSize(30)
      .setFont("Times New Roman", "bold")
      .text(95, 48, "Fixed Deposit Certificate");
    setUrl(doc.output("bloburi"));

    // doc.output("bloburi");
  };

  return (
    <Container size={"xl"}>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <PDFObject url={url || ""} />
      <MantineReactTable
        columns={columns}
        data={data}
        enableRowSelection={false}
        enableColumnOrdering={true}
        enableGlobalFilter={true}
        enableDensityToggle={false}
        initialState={{ density: "xs" }}
        renderTopToolbarCustomActions={() => (
          <Group>
            <Button
              variant="filled"
              color="red"
              onClick={() => router.push("/admin/accounts/new")}
              leftIcon={<IconCirclePlus />}
            >
              New Account
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
        renderRowActionMenuItems={({ row }) => (
          <>
            <Menu.Item
              onClick={() =>
                router.push(
                  `/admin/accounts/edit/${row.original.account_number}`
                )
              }
            >
              Edit
            </Menu.Item>
            <Menu.Item onClick={() => openModal(row.original.account_number)}>
              Delete
            </Menu.Item>
            {row.original.account_type === "Fixed Deposit" && (
              <Menu.Item
                onClick={() => getCertificate(row.original.account_number)}
              >
                Certificate
              </Menu.Item>
            )}
          </>
        )}
      />
    </Container>
  );
}
