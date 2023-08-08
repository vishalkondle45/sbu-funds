import DashboardItem from "@/components/admin/DashboardItem";
import HeaderComponent from "@/components/admin/Header";
import { SimpleGrid } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
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
      share_value,
    },
    setCount,
  ] = useState({});
  const router = useRouter();
  useEffect(() => {
    const getCount = async () => {
      await axios
        .get("/api/count")
        .then(({ data }) => {
          setCount(data.data);
        })
        .catch((error) => {
          router.push("/login");
        });
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
        <DashboardItem title="Share Value" count={share_value} />
      </SimpleGrid>
    </>
  );
}
