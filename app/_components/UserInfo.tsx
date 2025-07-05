"use client";

import { FC } from "react";
import { useSignOut, useUser } from "../_api";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";

export const UserInfo: FC = () => {
  const {
    data,
    isLoading
  } = useUser();

  const name = data?.name;
  const avatarUrl = data?.avatarUrl;

  const {
    mutateAsync: signout,
    isPending
  } = useSignOut()

  return (
    <div>
      {
        isLoading
          ? (
            <div className="flex items-start gap-4">
              <Skeleton className="h-[50px] w-[50px] rounded-full" />
              <div className="flex flex-col justify-between self-stretch">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>
          )
          : (
            <motion.div
              className="w-[600px] flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut"
              }}
            >
              <div
                className="flex items-start gap-4"
              >
                <Image
                  width={50}
                  height={50}
                  className="
                border-2
                shadow-sm hover:shadow-lg rounded-full
                hover:scale-105
                transition-all
                "
                  src={avatarUrl}
                  alt="avatarUrl"
                ></Image>
                <div className="border-b border-gray-400 flex flex-col justify-between self-stretch">
                  <h1 className="text-xs text-gray-400">别来无恙</h1>
                  <p className="text-lg text-gray-600 font-bold">{name ?? "undefine"}</p>
                </div>
                <div
                  className="
              self-end
              shadow-sm hover:shadow-lg rounded-xs py-0.5 px-2
              active:scale-95 bg-gray-800 hover:bg-gray-700 text-sm text-white cursor-pointer
              transition-all
              "
                  onClick={() => signout()}
                >
                  {isPending ? "Signout..." : "Signout"}
                </div>
              </div>
              <Link href="https://github.com/dao77777/gro-test/tree/main">
                <Image
                  src="/github.svg"
                  width={40}
                  height={40}
                  alt="github"
                />
              </Link>
            </motion.div>
          )
      }
    </div >
  )
}