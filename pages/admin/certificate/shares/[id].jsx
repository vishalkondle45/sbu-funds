import TextM from "@/components/Certificate/TextM";
import TextMB from "@/components/Certificate/TextMB";
import HeaderComponent from "@/components/admin/Header";
import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Title,
  Image,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconEye, IconPrinter } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
// import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToWords } from "to-words";

export default function Component() {
  const router = useRouter();
  const toWords = new ToWords();

  const [details, setDetails] = useState({
    name: "",
    customerId: 0,
    sharesFaceValue: 0,
    sharesCount: 0,
    sharesValue: 0,
  });

  useEffect(() => {
    const getDetails = async (id) => {
      await axios
        .get(`/api/certificate/shares/${id}`)
        .then((res) => {
          setDetails((details) => ({ ...details, ...res.data }));
        })
        .catch((err) => {
          console.log(err);
          showNotification({
            title: "Invalid ID",
            message: "Please check customer id.",
          });
          router.push("/admin");
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
      <Container
        pt={"md"}
        size="sm"
        style={{ fontFamily: "Times New Roman" }}
        id="certificate"
      >
        <Paper
          withBorder
          radius="xs"
          py={16}
          px={32}
          style={{ borderColor: "black" }}
        >
          <div style={{ textAlign: "center", marginBottom: 15 }}>
            <Group position="center">
              <Image src="/SBU-Final.png" width="100" />
              <Title order={2}>
                <Text ff="Times New Roman" size={28} fw={700}>
                  SBU Mutual Benefit Funds Nidhi Limited
                </Text>
              </Title>
            </Group>
            <Title order={3}>
              <Text ff="Times New Roman" size={23} fw={700}>
                Shares Certificate
              </Text>
            </Title>
          </div>
          <Group position="right">
            <TextMB>Date -</TextMB>
            <TextM>{dayjs(new Date()).format("DD/MM/YYYY")}</TextM>
          </Group>
          <Group position="right" mb="xl">
            <TextMB>Certificate No -</TextMB>
            <TextM>{details.customerId}</TextM>
          </Group>
          <Group position="apart" mb="xs">
            <Group>
              <TextMB>Name -</TextMB>
              <TextM>{details.name}</TextM>
            </Group>
          </Group>
          <Grid>
            <Grid.Col span={6}>
              <Group mb="xs">
                <TextMB>Customer ID -</TextMB>
                <TextM>{details.customerId}</TextM>
              </Group>
              <Group mb="xs">
                <TextMB>Shares Count - </TextMB>
                <TextM>{details.sharesCount}</TextM>
              </Group>
              <Group mb="xs">
                <TextMB>Shares Value - </TextMB>
                <TextM>{details.sharesValue}</TextM>
              </Group>
            </Grid.Col>
            <Grid.Col span={6}>
              <Group mb="xs">
                <TextMB>Share Face Value -</TextMB>
                <TextM>{details.sharesFaceValue}</TextM>
              </Group>
              <Group mb="xs">
                <TextMB>In Words - </TextMB>
                <TextM>{toWords.convert(details.sharesCount) + " Only"}</TextM>
              </Group>
              <Group mb="xs">
                <TextMB>In Words - </TextMB>
                <TextM>{toWords.convert(details.sharesValue) + " Only"}</TextM>
              </Group>
            </Grid.Col>
          </Grid>
          <Group position="right" pt={80}>
            <TextMB>Authorized Signatory</TextMB>
          </Group>
        </Paper>
      </Container>
    </>
  );
}
