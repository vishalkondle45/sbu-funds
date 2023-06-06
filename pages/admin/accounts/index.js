import Accounts from "@/components/admin/Accounts";
import HeaderComponent from "@/components/admin/Header";
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  return (
    <>
      <HeaderComponent />
      {session && <Accounts />}
    </>
  );
}
