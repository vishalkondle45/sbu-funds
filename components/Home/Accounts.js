import { SimpleGrid, Title } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Account from "./Account";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    const getAccounts = async () => {
      const { data } = await axios.get("/api/getAccounts");
      setAccounts(data.data);
    };
    getAccounts();
  }, []);
  return (
    <>
      <Title order={1}>Accounts</Title>
      <SimpleGrid cols={3}>
        {accounts.map((account) => (
          <Account account={account} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Accounts;
