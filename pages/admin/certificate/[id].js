import HeaderComponent from "@/components/admin/Header";
import jsPDF from "jspdf";
import { PDFObject } from "react-pdfobject";
import { ToWords } from "to-words";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Container } from "@mantine/core";

export default function Component() {
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

  doc.setFontSize(20).setFont("Times New Roman", "bold").text(5, 55, "Name - ");
  doc
    .setFontSize(18)
    .setFont("Courier", "normal")
    .text(30, 55, "Vishal Shridhar Kondle");
  doc
    .setFontSize(15)
    .setFont("Courier", "normal")
    .text(30, 65, "1492 G Group, Vidi Gharkul, Hyderabad Road, Solapur");

  doc
    .setFontSize(20)
    .setFont("Times New Roman", "bold")
    .text(205, 55, "Customer ID - ");
  doc.setFontSize(18).setFont("Courier", "normal").text(250, 55, "1111");

  doc
    .setFontSize(20)
    .setFont("Times New Roman", "bold")
    .text(5, 85, "Certificate No - ");
  doc.setFontSize(18).setFont("Times New Roman", "normal").text(55, 85, "1111");

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
  doc.setFontSize(18).setFont("Courier", "normal").text(55, 105, "1");

  doc
    .setFontSize(20)
    .setFont("Times New Roman", "bold")
    .text(120, 105, "In Words - ");
  doc.setFontSize(18).setFont("Courier", "normal").text(155, 105, "One Only");

  doc
    .setFontSize(20)
    .setFont("Times New Roman", "bold")
    .text(5, 125, "Shares Amount - ");
  doc
    .setFontSize(18)
    .setFont("Courier", "normal")
    .text(60, 125, Number("4000").toLocaleString("en-IN") + "/-");

  doc
    .setFontSize(20)
    .setFont("Times New Roman", "bold")
    .text(120, 125, "In Words - ");
  doc
    .setFontSize(18)
    .setFont("Courier", "normal")
    .text(155, 125, "Rs. " + toWords.convert(4000, { currency: true }));

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
    .text(235, 180, "S. D. Jatla");
  doc
    .setFontSize(20)
    .setFont("Times New Roman", "bold")
    .text(215, 190, "Authorized Signatory");

  let url = doc.output("bloburi");

  return (
    <>
      <HeaderComponent />
      <Container>
        <PDFObject url={url} width={2000} height={1000} />
      </Container>
    </>
  );
}
