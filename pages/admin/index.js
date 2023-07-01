import DashboardItem from "@/components/admin/DashboardItem";
import HeaderComponent from "@/components/admin/Header";
import { SimpleGrid } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [
    {
      customer,
      account,
      transaction,
      deposit,
      withdrawl,
      cheque,
      transfer,
      neft,
      rtgs,
    },
    setCount,
  ] = useState({});
  useEffect(() => {
    const getCount = async () => {
      const { data } = await axios.get("/api/count");
      setCount(data.data);
    };
    getCount();
  }, []);

  return (
    <>
      <HeaderComponent />

      <SimpleGrid cols={5}>
        <DashboardItem title="Customers" count={customer} />
        <DashboardItem title="Accounts" count={account} />
        <DashboardItem title="Transactions" count={transaction} />
        <DashboardItem title="Deposit" count={deposit} />
        <DashboardItem title="Withdrawl" count={withdrawl} />
        <DashboardItem title="Cheque" count={cheque} />
        <DashboardItem title="Transfer" count={transfer} />
        <DashboardItem title="NEFT" count={neft} />
        <DashboardItem title="RTGS" count={rtgs} />
      </SimpleGrid>
    </>
  );
}
