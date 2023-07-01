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
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useRouter } from "next/router";
import {
  IconCertificate,
  IconCheck,
  IconCirclePlus,
  IconDownload,
  IconTableExport,
  IconTableImport,
  IconX,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import * as XLSX from "xlsx";
import { notifications } from "@mantine/notifications";
import { IconUpload } from "@tabler/icons-react";
import { ToWords } from "to-words";
import jsPDF from "jspdf";

export default function Customers() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [value, setValue] = useState(null);

  const getCertificate = async (cid) => {
    const {
      data: {
        data: { name, id, shares, address },
      },
    } = await axios.get(`/api/customer?id=${cid}`, {
      filters: router.query,
    });
    console.log(data);
    const toWords = new ToWords();
    var doc = new jsPDF("l", "mm", "a4");

    doc.addImage(process.env.LOGO_BASE64, "PNG", 5, 2, 40, 20);
    doc
      .setFontSize(30)
      .setFont("Times New Roman", "bold")
      .text(48, 16, "SBU MUTUAL BENEFIT FUNDS NIDHI LIMITED");
    doc
      .setFontSize(50)
      .setFont("Times New Roman", "bold")
      .text(80, 35, "Shares Certificate");

    doc
      .setFontSize(20)
      .setFont("Times New Roman", "bold")
      .text(5, 55, "Name - ");
    doc.setFontSize(18).setFont("Courier", "normal").text(30, 55, name);
    doc.setFontSize(15).setFont("Courier", "normal").text(30, 65, address);

    doc
      .setFontSize(20)
      .setFont("Times New Roman", "bold")
      .text(205, 55, "Customer ID - ");
    doc.setFontSize(18).setFont("Courier", "normal").text(250, 55, String(id));

    doc
      .setFontSize(20)
      .setFont("Times New Roman", "bold")
      .text(5, 85, "Certificate No - ");
    doc.setFontSize(18).setFont("Courier", "normal").text(55, 85, String(id));

    doc
      .setFontSize(20)
      .setFont("Times New Roman", "bold")
      .text(120, 85, "Share Face Value - ");
    doc
      .setFontSize(18)
      .setFont("Courier", "normal")
      .text(
        180,
        85,
        Number(process.env.SHARE_PRICE).toLocaleString("en-IN") + "/-"
      );

    doc
      .setFontSize(20)
      .setFont("Times New Roman", "bold")
      .text(5, 105, "Shares Count - ");
    doc
      .setFontSize(18)
      .setFont("Courier", "normal")
      .text(55, 105, String(shares));

    doc
      .setFontSize(20)
      .setFont("Times New Roman", "bold")
      .text(120, 105, "In Words - ");
    doc
      .setFontSize(18)
      .setFont("Courier", "normal")
      .text(155, 105, toWords.convert(shares) + " Only");

    doc
      .setFontSize(20)
      .setFont("Times New Roman", "bold")
      .text(5, 125, "Shares Amount - ");
    doc
      .setFontSize(18)
      .setFont("Courier", "normal")
      .text(
        60,
        125,
        Number(shares * process.env.SHARE_PRICE).toLocaleString("en-IN") + "/-"
      );

    doc
      .setFontSize(20)
      .setFont("Times New Roman", "bold")
      .text(120, 125, "In Words - ");
    doc
      .setFontSize(18)
      .setFont("Courier", "normal")
      .text(
        155,
        125,
        "Rs. " +
          toWords.convert(Number(shares * process.env.SHARE_PRICE), {
            currency: true,
          })
      );

    doc
      .setFontSize(20)
      .setFont("Times New Roman", "bold")
      .text(5, 145, "Date - ");
    doc
      .setFontSize(18)
      .setFont("Courier", "normal")
      .text(25, 145, dayjs().format("DD/MM/YYYY"));

    doc
      .setFontSize(18)
      .setFont("Times New Roman", "normal")
      .text(235, 190, "S. D. Jatla");
    doc
      .setFontSize(20)
      .setFont("Times New Roman", "bold")
      .text(215, 200, "Authorized Signatory");

    doc.setLineWidth(2);
    doc.rect(2, 2, 293, 206);
    doc.save(`Certificate - ${id}`);
  };

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
      .put("/api/import?table=customers", JsonData)
      .then((response) => {
        notifications.show({
          message: response.data.message,
          icon: <IconCheck />,
          color: "green",
          title: "Customers updated successfully ✌️",
        });
        console.log(response.data);
        setValue(null);
        getCustomers();
      })
      .catch((error) => {
        console.log(error);
        notifications.show({
          message: error.response.data.message,
          icon: <IconX />,
          color: "red",
          title: "Customers updated failed ✌️",
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
                color="red"
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
          <Menu.Item onClick={() => getCertificate(row.original.id)}>
            Certificate
          </Menu.Item>,
        ]}
      />
    </Container>
  );
}
