"use client";
import { useEffect, useState } from "react";
import SignupDialog from "./SignupForm";
import supabaseClient from "../../../lib/supabaseClient";
import BlockFormDialog from "./BlockForm";
import axios from "axios";
import User from "./interfaces/User";
import QuietBlock from "./interfaces/QuietBlock";
import { format } from "date-fns";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginForm from "./LoginForm";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";

const DashBoard = () => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [quietBlocks, setQuietBlock] = useState<QuietBlock[]>();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser();
      console.log(user?.user_metadata);
      setCurrentUser({ uid: user?.id, username: user?.user_metadata.username });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const getUserBlocks = async () => {
      const res = await axios.get(
        `/api/quietBlock/allBlocks/${currentUser.uid}`
      );
      setQuietBlock(res.data);
    };

    getUserBlocks();
  }, [currentUser]);

  const getFormattedDate = (date: Date) => {
    console.log(date);
    return format(date, "dd MMM yyyy HH:mm");
  };

  const logoutCurrentUser = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    window.location.href = "/";
  };

  return (
    <>
      <div className="w-[90%] h-auto border-1 border-stone-400 m-auto mt-6 p-5 rounded-xl">
        <main>
          <div className="flex justify-between items-center">
            <p className="text-6xl">Welcome {currentUser?.username} !</p>
            {currentUser?.uid == undefined ? (
              <div className="w-50 p-4 flex justify-between items-center">
                <LoginForm />
                <SignupDialog />
              </div>
            ) : (
              <Button variant="outline" size="lg" onClick={logoutCurrentUser}>
                logout
              </Button>
            )}
          </div>
          <div className="flex justify-end items-center mt-50 mb-5">
            <BlockFormDialog />
          </div>
          {quietBlocks && quietBlocks.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-20 gap-y-20">
              {quietBlocks.map((block) => (
                <div>
                  <Card className="w-[25rem]">
                    <CardHeader>
                      <CardTitle>{block.title}</CardTitle>
                      <CardDescription>{block.description}</CardDescription>
                      <CardAction>{block.status}</CardAction>
                    </CardHeader>
                    <CardFooter>
                      <div className="w-full flex justify-between align-middle">
                        <p>{getFormattedDate(block.startsAt)}</p>
                        <p>{getFormattedDate(block.endsAt)}</p>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          ) : null}
        </main>
      </div>
    </>
  );
};

export default DashBoard;
