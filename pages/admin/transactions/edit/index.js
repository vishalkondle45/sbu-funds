import HeaderComponent from "@/components/admin/Header";
import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Component() {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/transactions");
  }, []);
  return (
    <>
      <HeaderComponent />
      <LoadingOverlay visible={true} />
    </>
  );
}
