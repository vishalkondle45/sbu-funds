import { Loader, LoadingOverlay, Table, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const LastFiveTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  const [visible, handlers] = useDisclosure(false);
  useEffect(() => {
    const getTransactions = async () => {
      handlers.open();
      const { data } = await axios.get("/api/lastFiveTransactions");
      setTransactions(data.data);
      handlers.close();
    };
    getTransactions();
  }, []);

  const rows = transactions.map((transaction) => (
    <tr key={transaction.transaction_id}>
      <td>{dayjs(transaction.createdAt).format("DD-MM-YYYY")}</td>
      <td>{transaction.transaction_id}</td>
      <td>{transaction.from}</td>
      <td>{transaction.to}</td>
      <td>
        {transaction.amount.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        })}
      </td>
      <td>{transaction.transaction_type}</td>
      <td>{transaction.comments}</td>
    </tr>
  ));

  return (
    <div>
      <Title mt={"xl"} order={1}>
        Last 5 Transactions
      </Title>

      <LoadingOverlay
        visible={visible}
        loader={<Loader variant="dots" />}
        overlayBlur={2}
      />
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr style={{ backgroundColor: "#FA5252" }}>
            <th style={{ color: "white" }}>Date</th>
            <th style={{ color: "white" }}>ID</th>
            <th style={{ color: "white" }}>From</th>
            <th style={{ color: "white" }}>To</th>
            <th style={{ color: "white" }}>Amount</th>
            <th style={{ color: "white" }}>Type</th>
            <th style={{ color: "white" }}>Comments</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};

export default LastFiveTransactions;
