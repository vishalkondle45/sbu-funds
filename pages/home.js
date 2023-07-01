import { useSession } from "next-auth/react";

export default function Component() {
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/login";
    },
  });
  return <>Home</>;
}
