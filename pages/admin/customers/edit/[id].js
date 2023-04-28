import CustomerEdit from "@/components/admin/CustomerEdit";
import HeaderComponent from "@/components/admin/Header";
import { useRouter } from "next/router";

export default function Component() {
  const router = useRouter();
  return (
    <>
      <HeaderComponent />
      <CustomerEdit id={router.query.id} />
    </>
  );
}
