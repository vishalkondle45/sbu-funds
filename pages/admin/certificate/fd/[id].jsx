import HeaderComponent from "@/components/admin/Header";
import {
  Box,
  Container,
  // Image,
  Paper,
  SimpleGrid,
  Table,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Component() {
  const router = useRouter();

  useEffect(() => {
    const getFDCertificate = () => {};
    // getFDCertificate(req.query.id);
    console.log(router.query.id);
  }, [router.query]);

  return (
    <>
      <HeaderComponent />
      <Container size="sm" style={{ fontFamily: "Times New Roman" }}>
        <Box style={{ textAlign: "center" }}>
          <h1>SBU Mutual Benefit Funds Nidhi Limited</h1>
          <h5>
            Registered Address - 1091, C1 Group, Sagar Chowk, Vidi
            Gharkul,Hyderabad Road, Solapur - 413005
          </h5>
          <h5>Registration No - U64990PN2023PLN219751</h5>
          <h2>Fixed Deposit Certificate</h2>
        </Box>
        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>
                <Text style={{ fontFamily: "Times New Roman" }}>
                  Account Number
                </Text>
              </th>
              <th>
                <Text style={{ fontFamily: "Times New Roman" }}>Amount</Text>
              </th>
              <th>
                <Text style={{ fontFamily: "Times New Roman" }}>
                  Interest Rate
                </Text>
              </th>
              <th>
                <Text style={{ fontFamily: "Times New Roman" }}>Period</Text>
              </th>
              <th>
                <Text style={{ fontFamily: "Times New Roman" }}>
                  Start Date
                </Text>
              </th>
              <th>
                <Text style={{ fontFamily: "Times New Roman" }}>
                  Maturity Date
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Text style={{ fontFamily: "Times New Roman" }}>1111</Text>
              </td>
              <td>
                <Text style={{ fontFamily: "Times New Roman" }}>10000</Text>
              </td>
              <td>
                <Text style={{ fontFamily: "Times New Roman" }}>9%</Text>
              </td>
              <td>
                <Text style={{ fontFamily: "Times New Roman" }}>
                  120 Months
                </Text>
              </td>
              <td>
                <Text style={{ fontFamily: "Times New Roman" }}>
                  05-08-2023
                </Text>
              </td>
              <td>
                <Text style={{ fontFamily: "Times New Roman" }}>
                  05-08-2033
                </Text>
              </td>
            </tr>
          </tbody>
        </Table>
        <Paper mt="xs" radius="xs" p="md" withBorder>
          <Text style={{ fontFamily: "Times New Roman" }}>
            One Lakh Rupees Only
          </Text>
        </Paper>

        <Paper mt="xs" radius="xs" p="md" withBorder>
          <SimpleGrid cols={2}>
            <Text style={{ fontFamily: "Times New Roman" }}>Received From</Text>
            <Text style={{ fontFamily: "Times New Roman" }}>
              : Vishal Shridhar Kondle
              <Text style={{ fontFamily: "Times New Roman" }}>
                1492, G Group Vidi Gharkul Hyderabad Road Solapur
              </Text>
            </Text>
            <Text style={{ fontFamily: "Times New Roman" }}>Customer ID</Text>
            <Text style={{ fontFamily: "Times New Roman" }}>: 111</Text>
            <Text style={{ fontFamily: "Times New Roman" }}>Date of Issue</Text>
            <Text style={{ fontFamily: "Times New Roman" }}>: 05-08-2023</Text>
            <Text style={{ fontFamily: "Times New Roman" }}>
              Interest Calculation Method
            </Text>
            <Text style={{ fontFamily: "Times New Roman" }}>
              : Compound Interest at Quarterly Rests
            </Text>
            <Text style={{ fontFamily: "Times New Roman" }}>
              Maturity Amount
            </Text>
            <Text style={{ fontFamily: "Times New Roman" }}>
              : Rs. 24, 352.00
            </Text>
          </SimpleGrid>
        </Paper>
      </Container>
    </>
  );
}
