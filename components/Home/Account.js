import { Group, Loader, Paper, Switch, Title } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Account = ({ account }) => {
  console.log(account);
  const [balance, setBalance] = useState(null);
  useEffect(() => {
    const getBalance = async () => {
      setBalance(null);
      const { data } = await axios.get(
        `/api/getBalance?account_number=${account}`
      );
      setBalance(data.data);
    };
    if (account) {
      getBalance();
    }
  }, []);

  return (
    <div>
      <Paper
        shadow="xl"
        p="md"
        style={{ backgroundColor: "#FA5252" }}
        withBorder
      >
        <Title order={3} color="white" italic>
          <Group position="apart">{account}</Group>
        </Title>
        <Title order={1} align="right" color="white">
          {balance !== null ? (
            balance?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })
          ) : (
            <Loader variant="dots" color="white" />
          )}
        </Title>
      </Paper>
    </div>
  );
};

export default Account;
