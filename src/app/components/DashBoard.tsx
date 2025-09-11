"use client";
import { useEffect, useState } from "react";
import SignupDialog from "./SignupForm";
import supabaseClient from "../../../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import BlockFormDialog from "./BlockForm";

const DashBoard = () => {
  const [currentUser, setCurrentUser] = useState<string>("");
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabaseClient.auth.getUser();
      setCurrentUser(data.user?.user_metadata.username);
    };

    fetchUser();
  }, []);
  return (
    <>
      {!currentUser ? (
        <SignupDialog />
      ) : (
        <>
          <p className="text-6xl">{currentUser}</p>
          <BlockFormDialog />
        </>
      )}
    </>
  );
};

export default DashBoard;
