"use client";

import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { getSupabase } from "../_lib/supabase/browserClient";
import { MessageContainer } from "./MessageContainer";
import { ChevronsUpDown, Download, Trash } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useChangeLeadMessageStatus, useDeleteLeadMessage, useLeadsMessages } from "../_api";
import { arr2CSV, exportCSV, getHMSFromDate, getYMDFomDate } from "../_utils";

export const LeadsTalbe: FC = () => {
  const {
    data,
    isLoading,
    isFetching,
  } = useLeadsMessages();

  const {
    mutateAsync: changeLeadMesssageStatus
  } = useChangeLeadMessageStatus();

  const {
    mutateAsync: deleteLeadMessage,
  } = useDeleteLeadMessage();

  const handleExportCSV = () => {
    const arr = [
      ["Name", "Role", "Company", "LinkedinURL", "Message", "Status", "CreatedAt"],
      ...data!.map(item => [
        item.name,
        item.role,
        item.company,
        item.linkedin_url,
        item.message,
        item.status,
        item.created_at
      ])
    ]

    const csv = arr2CSV(arr);

    exportCSV(csv);
  }

  return (
    <div className="w-[900px]">
      <div className="p-4 w-full"><div className="relative group w-full shadow shadow-gray-100/90 rounded-xs border-[1px] border-gray-100/90 p-4 hover:shadow-lg hover:shadow-gray-200/90 transition-all bg-gradient-to-tl from-white/90 to-gray-200/90 from-80%">
        <div className={`absolute top-0 left-0 -translate-1/3 w-5 h-5 bg-gray-800/10 rotate-30 rounded-xs group-hover:rotate-90 transition-all`}>
          <div className={`absolute left-1/2 top-1/2 -translate-1/2 w-5 h-5 rounded-xs border-[0px] border-gray-800/0 ${isFetching && "border-[1px] animate-ping border-gray-800/90"}`}></div>
        </div>
        <div className="flex justify-between">
          <div>
            <h1 className="text-gray-800 text-lg font-bold">Leads Management</h1>
            <p className="text-gray-400 text-sm">Manage your outreach leads and generated messages</p>
          </div>
          <div
            className="
            px-4 border hover:border-gray-400 h-10 
            flex items-center gap-2 
            text-gray-800 cursor-pointer
            transition-all
            "
            onClick={handleExportCSV}
          >
            <Download size={16} />
            <span className="text-xs">Export CSV</span>
          </div>
        </div>
        <div className="w-full h-4"></div>
        <div className="w-full flex justify-between gap-2 text-gray-400/90 font-bold py-2 border-b-[1px] border-gray-400/90">
          <div className="w-32">Name</div>
          <div className="w-32">Role</div>
          <div className="w-32">Company</div>
          <div className="w-40">LinkedinURL</div>
          <div className="w-40">Status</div>
          <div className="w-40">CreatedAt</div>
          <div className="w-40">Delete</div>
          <div className="w-40">Expand</div>
        </div>
        <div className="w-full h-4"></div>
        <div className="w-full relative">
          <div className={`w-full h-full flex flex-col justify-start gap-2 ${isLoading ? "opacity-0" : "opacity-100"} transition-all duration-500`}>
            {data && data.map(item => (
              <Item
                key={item.id}
                name={item.name}
                role={item.role}
                company={item.company}
                linkedinURL={item.linkedin_url}
                message={item.message}
                status={item.status}
                createdAt={new Date(item.created_at)}
                onStatusChange={(status) => changeLeadMesssageStatus({ id: item.id, status })}
                onDelete={() => deleteLeadMessage(item.id)}
              ></Item>
            ))}
          </div>
          {isLoading && <div className="w-full h-full flex items-center justify-center text-xl text-gray-200/90 font-boldr">Loading...</div>}
          {(!isLoading && (!data || data!.length === 0)) && <div className="w-full h-full flex items-center justify-center text-xl text-gray-200/90 font-bold">No Content</div>}
        </div>
      </div></div>
    </div>
  )
}

export const Item: FC<{
  name: string,
  role: string,
  company: string,
  linkedinURL: string,
  message: string,
  status: string,
  createdAt: Date,
  onStatusChange: (status: string) => void,
  onDelete: () => void
}> = ({
  name,
  role,
  company,
  linkedinURL,
  message,
  status,
  createdAt,
  onStatusChange,
  onDelete
}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-2"
      >
        <div className="
        flex items-center justify-between gap-2 
        text-gray-600  bg-gray-100/0 hover:bg-gray-50/90
        transition-all
        ">
          <div className="w-32 truncate" title={name}>{name}</div>
          <div className="w-32 truncate" title={role}>{role}</div>
          <div className="w-32 truncate" title={company}>{company}</div>
          <div className="w-40 truncate" title={linkedinURL}>{linkedinURL}</div>
          <div className="w-40 flex items-center">
            <Select defaultValue={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-40 flex flex-col items-start text-xs ">
            <div className="text-gray-600">{getYMDFomDate(createdAt)}</div>
            <div className="text-gray-400">{getHMSFromDate(createdAt)}</div>
          </div>
          <div className="w-40 ">
            <Trash
              size={16}
              className="text-red-800 hover:text-red-600 cursor-pointer"
              onClick={onDelete}
            />
          </div>
          <div className="w-40">
            <CollapsibleTrigger asChild>
              <ChevronsUpDown className="text-gray-800 hover:text-gray-500 cursor-pointer" />
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <MessageContainer generateMessage={message} />
        </CollapsibleContent>
      </Collapsible>
    )
  }
