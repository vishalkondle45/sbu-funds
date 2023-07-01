import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
const logout = () => {
  useEffect(() => {
    signOut();
    window.location.href = "/login";
  }, []);

  return <></>;
};

export default logout;
