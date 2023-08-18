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
  Box,
  Center,
  BackgroundImage,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconDownload, IconEye, IconPrinter } from "@tabler/icons-react";
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
    createdAt: new Date(),
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
          router.push("/admin/home");
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
        <Button leftIcon={<IconDownload size="1rem" />} onClick={printPDF}>
          Save
        </Button>
        <Button leftIcon={<IconPrinter size="1rem" />} onClick={openPDF}>
          Print
        </Button>
      </Group>
      <Container
        pt={"md"}
        size="sm"
        style={{
          fontFamily: "Times New Roman",
        }}
        id="certificate"
      >
        <Paper
          withBorder
          radius="xs"
          py={4}
          px={32}
          style={{ borderColor: "#4DABF7", borderWidth: "10px" }}
        >
          <div style={{ textAlign: "center" }}>
            <Group position="center">
              <Grid spacing="xs">
                <Grid.Col span={1}>
                  <Image
                    src="/SBU-Logo-Final.png"
                    style={{ width: 35, marginTop: 5 }}
                  />
                </Grid.Col>
                <Grid.Col span={11}>
                  <Text color="blue" ff="Times New Roman" size={30} fw={700}>
                    SBU Mutual Benefit Funds Nidhi Ltd.
                  </Text>
                </Grid.Col>
              </Grid>
              <TextMB mb="-xs" fz="sm" mt="-xl">
                Registered Add - 1091, Sagar Chowk, Vidi Gharkul, Solapur -
                413005
              </TextMB>
              <Group mb="-xs" mt="-xs">
                <TextMB>Registration No -</TextMB>
                <TextM>U64990PN2023PLN219751</TextM>
              </Group>
            </Group>
            <Title order={3} mt="xs">
              <Text ff="Times New Roman" color="indigo" size={26} fw={700}>
                Shares Certificate
              </Text>
            </Title>
          </div>
          <Group position="right">
            <TextM fz={"sm"}>Date -</TextM>
            <TextMB fz={"sm"}>
              {dayjs(details.createdAt).format("DD/MM/YYYY")}
            </TextMB>
          </Group>
          <Group position="right">
            <TextM fz={"sm"}>Certificate No -</TextM>
            <TextMB fz={"sm"}>{details.customerId}</TextMB>
          </Group>
          <Grid grow gutter="xs">
            <Grid.Col span={2}>
              <TextM>Name -</TextM>
              <TextM>Address -</TextM>
            </Grid.Col>
            <Grid.Col span={10}>
              <TextMB>{details.name}</TextMB>
              <TextMB>{details.address}</TextMB>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={5}>
              <Group>
                <TextM>Customer ID -</TextM>
                <TextMB>{details.customerId}</TextMB>
              </Group>
              <Group>
                <TextM>Shares Count - </TextM>
                <TextMB>{details.sharesCount.toLocaleString("en-IN")}</TextMB>
              </Group>
              <Group>
                <TextM>Shares Value - </TextM>
                <TextMB>
                  Rs.
                  {details.sharesValue.toLocaleString("en-IN")}
                  /-
                </TextMB>
              </Group>
            </Grid.Col>
            <Grid.Col span={7}>
              <Group>
                <TextM>Share Face Value -</TextM>
                <TextMB>
                  Rs.
                  {details.sharesFaceValue.toLocaleString("en-IN")}/-
                </TextMB>
              </Group>
              <Group>
                <TextM>In Words - </TextM>
                <TextMB>
                  {toWords.convert(details.sharesCount, { currency: false }) +
                    " Only"}
                </TextMB>
              </Group>
              <Group>
                <TextM>In Words - </TextM>
                <TextMB>
                  {toWords.convert(details.sharesValue, { currency: true })}
                </TextMB>
              </Group>
            </Grid.Col>
          </Grid>
          <Group position="right" pt={100}>
            <TextMB>Authorized Signatory</TextMB>
          </Group>
          {/* </BackgroundImage> */}
        </Paper>
      </Container>
    </>
  );
}
