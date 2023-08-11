import { Table, Text, Title, useMantineTheme } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";

const InterestRates = () => {
  const [interests, setInterests] = useState([]);
  useEffect(() => {
    const getInterests = async () => {
      await axios
        .get("/api/interest")
        .then((res) => {
          setInterests(res.data.data);
        })
        .catch(() => {
          setInterests([]);
        });
    };
    getInterests();
  }, []);

  const theme = useMantineTheme();
  return (
    <>
      <Text fz={30} ff="monospace" ta="center" c={theme.primaryColor}>
        Interest Rates
      </Text>
      <Table
        striped
        highlightOnHover
        withBorder
        withColumnBorders
        // bg={theme.primaryColor}
      >
        <thead style={{ backgroundColor: theme.primaryColor }}>
          <tr style={{ textAlign: "center" }}>
            <th style={{ textAlign: "center", color: "#fff" }}>Duration</th>
            <th style={{ textAlign: "center", color: "#fff" }}>Interest</th>
            <th style={{ textAlign: "center", color: "#fff" }}>
              Interest for Senior Citizens
            </th>
          </tr>
        </thead>
        <tbody>
          {interests?.map((element) => (
            <tr key={element.from} style={{ textAlign: "center" }}>
              <td style={{ fontWeight: "bold" }}>{element.comments}</td>
              <td style={{ fontWeight: "bold" }}>{element.interest}%</td>
              <td style={{ fontWeight: "bold" }}>{element.interest60}%</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default InterestRates;
