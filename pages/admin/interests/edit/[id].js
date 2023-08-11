import InterestEdit from "@/components/admin/InterestEdit";
import HeaderComponent from "@/components/admin/Header";
import { useRouter } from "next/router";

export default function Component() {
  const router = useRouter();
  return (
    <>
      <HeaderComponent />
      <InterestEdit id={router.query.id} />
    </>
  );
}
