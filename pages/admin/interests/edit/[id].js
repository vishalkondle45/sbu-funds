import TransactionEdit from "@/components/admin/TransactionEdit";
import HeaderComponent from "@/components/admin/Header";
import { useRouter } from "next/router";

export default function Component() {
  const router = useRouter();
  return (
    <>
      <HeaderComponent />
      <TransactionEdit id={router.query.id} />
    </>
  );
}
