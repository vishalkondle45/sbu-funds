import HeaderComponent from "@/components/admin/Header";
import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Image,
  Text,
  List,
  Table,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconEye, IconPrinter } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Component() {
  const router = useRouter();
  const [details, setDetails] = useState({});

  useEffect(() => {
    console.log(router);
    const getDetails = async (id) => {
      await axios
        .get(
          `/api/statement/${router.query.id}?from=${router.query.from}&to=${router.query.to}`
        )
        .then((res) => {
          console.log(res.data);
          setDetails(res.data);
        })
        .catch((err) => {
          console.log(err);
          showNotification({
            title: "Problem",
            message: "Please check with VISHAL.",
          });
          router.push("/admin/statement");
        });
    };
    if (router.query.id) {
      getDetails(router.query.id);
    }
  }, [router.query]);

  function printPDF() {
    let doc = new jsPDF("p", "pt", "a4");
    doc.html(document.getElementById("certificate"), {
      html2canvas: {
        scale: 600 / document.getElementById("certificate").scrollWidth,
      },
      callback: (pdf) => pdf.save("Certifate.pdf"),
      marginTop: 10,
    });
  }
  function openPDF() {
    let doc = new jsPDF("p", "pt", "a4");
    doc.html(document.getElementById("certificate"), {
      html2canvas: {
        scale: 600 / document.getElementById("certificate").scrollWidth,
      },
      callback: (pdf) => window.open(pdf.output("bloburl")),
      marginTop: 10,
    });
  }

  const rows = details?.transactions?.map((element) => (
    <tr key={element.transaction_id}>
      <td>{dayjs(element.createdAt).format("DD-MMM-YYYY")}</td>
      <td>{element.transaction_id}</td>
      <td>{element.from || "Deposit"}</td>
      <td>{element.to || "Withdrawl"}</td>
      <td>
        <Text
          color={element.from === router.query.id ? "red" : "green"}
          fw="bold"
        >
          {element.from ? "-" : "+"}
          {element.amount.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            currency: "INR",
          })}
        </Text>
      </td>
      <td>
        {element.from === router.query.id
          ? element.from_balance.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              currency: "INR",
            })
          : element.to_balance.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              currency: "INR",
            })}
      </td>
      <td>{element.comments}</td>
    </tr>
  ));

  return (
    <>
      <HeaderComponent />
      <Group position="center">
        <Button leftIcon={<IconPrinter size="1rem" />} onClick={printPDF}>
          Print
        </Button>
        <Button leftIcon={<IconEye size="1rem" />} onClick={openPDF}>
          View
        </Button>
      </Group>

      <Container pt={"md"} size="md" id="certificate">
        <Paper
          withBorder
          radius="xs"
          pt={8}
          pb={16}
          px={16}
          // style={{ borderColor: "#4DABF7", borderWidth: "4px" }}
        >
          <Grid spacing="xs">
            <Grid.Col span={2}>
              <Image src="/Title_Logo.png" style={{ marginTop: 5 }} />
            </Grid.Col>
          </Grid>
          <List withPadding spacing="xs" style={{ fontFamily: "monospace" }}>
            <List.Item>
              Account Name &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;:{" "}
              <span style={{ fontWeight: 700, letterSpacing: "1px" }}>
                {details?.customer?.name}
              </span>
            </List.Item>
            <List.Item>
              Address
              &emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;:{" "}
              <span style={{ fontWeight: 700, letterSpacing: "1px" }}>
                {details?.customer?.address}
              </span>
            </List.Item>
            <List.Item>
              Date
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              :{" "}
              <span style={{ fontWeight: 700, letterSpacing: "1px" }}>
                {dayjs().format("DD MMM YYYY")}
              </span>
            </List.Item>
            <List.Item>
              Account Number &emsp;&nbsp;&emsp;&emsp;&emsp;:{" "}
              <span style={{ fontWeight: 700, letterSpacing: "1px" }}>
                {details?.account?.account_number}
              </span>
            </List.Item>
            <List.Item>
              Account Description :{" "}
              <span style={{ fontWeight: 700, letterSpacing: "1px" }}>
                {details?.account?.account_type}
              </span>
            </List.Item>
            <List.Item>
              Balance({dayjs().format("DD-MM-YYYY")}) :{" "}
              <span style={{ fontWeight: 700, letterSpacing: "1px" }}>
                {details?.balance?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  currency: "INR",
                })}
              </span>
            </List.Item>
          </List>

          <Table
            style={{ fontFamily: "monospace" }}
            striped
            highlightOnHover
            withBorder
            withColumnBorders
            mt="md"
          >
            <thead>
              <tr>
                <th style={{ width: "12%" }}>Date</th>
                <th style={{ width: "12%" }}>Trans. ID</th>
                <th style={{ width: "13%" }}>From Account</th>
                <th style={{ width: "12%" }}>To Account</th>
                <th style={{ width: "10%" }}>Amount</th>
                <th style={{ width: "10%" }}>Balance</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Paper>
      </Container>
    </>
  );
}
