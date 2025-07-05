"use client"

import { FC, useMemo, useState } from "react";
import { LeadsManagementShell } from "./LeadsManagementShell";
import { LeadsTalbe } from "./LeadsTable";
import { useChangeLeadMessageStatus, useDeleteLeadMessage, useLeadMessages } from "@/app/_api";
import { arr2CSV } from "@/app/_utils";
import { LeadsDrag } from "./LeadsDrag";
import { AnimatePresence, motion } from "framer-motion";
import { Loading } from "../Loading";

export const LeadsManagement: FC = () => {
  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useLeadMessages();

  const csv = useMemo(() => {
    if (!data) return "";

    return arr2CSV([
      ["Name", "Role", "Company", "LinkedinURL", "Message", "Status", "CreatedAt"],
      ...data.map(item => [
        item.name,
        item.role,
        item.company,
        item.linkedin_url,
        item.message,
        item.status,
        item.created_at
      ])
    ])
  }, [data]);

  const {
    mutateAsync: changeLeadMesssageStatus
  } = useChangeLeadMessageStatus();

  const {
    mutateAsync: deleteLeadMessage,
  } = useDeleteLeadMessage();

  const [style, setStyle] = useState<"table" | "drag">("table");

  return (
    <LeadsManagementShell
      csv={csv}
      isFetching={isFetching}
      onStyleChange={() => setStyle(style === "table" ? "drag" : "table")}
    >
      <div className="w-full h-4"></div>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            className="flex justify-center"
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ><Loading className="w-10 h-10 text-gray-300"></Loading></motion.div>
        )}
        {isError && <div>Error</div>}
        {!isLoading && !isLoading && data && (style === "table"
          ? (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LeadsTalbe
                data={data}
                onChangeLeadMessageStatus={changeLeadMesssageStatus}
                onDeleteLeadMessage={deleteLeadMessage}
              />
            </motion.div>
          )
          : (
            <motion.div
              key="drag"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LeadsDrag
                data={data}
                onChangeLeadMessageStatus={changeLeadMesssageStatus}
                onDeleteLeadMessage={deleteLeadMessage}
              />
            </motion.div>
          ))}
      </AnimatePresence>
    </LeadsManagementShell>
  )
}