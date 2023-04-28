import AccountEdit from "@/components/admin/AccountEdit";
import HeaderComponent from "@/components/admin/Header";
import { useRouter } from "next/router";

export default function Component() {
  const router = useRouter();
  return (
    <>
      <HeaderComponent />
      <AccountEdit id={router.query.id} />
    </>
  );
}
