import HeaderComponent from "@/components/admin/Header";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Component() {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/home");
  }, []);
  return <></>;
}
