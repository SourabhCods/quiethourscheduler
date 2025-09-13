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
import { useRouter } from "next/navigation";
import { LogOut, LogIn, UserPlus, Loader2Icon } from "lucide-react";

const DashBoard = () => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [quietBlocks, setQuietBlock] = useState<QuietBlock[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
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
    return format(date, "dd MMM yyyy HH:mm");
  };

  const handleOnLogout = async () => {
    setIsLoading(true);
    try {
      await supabaseClient.auth.signOut();
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[95%] max-w-7xl mx-auto mt-6 p-5 rounded-xl border border-stone-400">
      <main>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans font-semibold tracking-tight text-3xl md:text-5xl lg:text-6xl text-center md:text-left">
            Welcome {currentUser?.username} !
          </p>

          {currentUser?.uid == undefined ? (
            <div className="flex gap-4">
              <LoginForm />
              <SignupDialog />
            </div>
          ) : (
            <Button
              onClick={handleOnLogout}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              ) : (
                "Logout"
              )}
            </Button>
          )}
        </div>

        <div className="flex justify-end items-center mt-10 mb-5">
          <BlockFormDialog />
        </div>

        {quietBlocks && quietBlocks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {quietBlocks.map((block) => (
              <Card key={block.id} className="w-full">
                <CardHeader>
                  <CardTitle>{block.title}</CardTitle>
                  <CardDescription>{block.description}</CardDescription>
                  <CardAction className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                    {block.status}
                  </CardAction>
                </CardHeader>
                <CardFooter>
                  <div className="w-full flex flex-col sm:flex-row justify-between gap-2">
                    <p>{getFormattedDate(block.startsAt)}</p>
                    <p>{getFormattedDate(block.endsAt)}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default DashBoard;
