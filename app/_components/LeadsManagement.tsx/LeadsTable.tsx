"use client";

import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { getSupabase } from "../../_lib/supabase/browserClient";
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
import { useChangeLeadMessageStatus, useDeleteLeadMessage, useLeadMessages } from "../../_api";
import { arr2CSV, exportCSV, getHMSFromDate, getYMDFomDate } from "../../_utils";
import { MarkdownEditor } from "../Input/MarkdownEditor/MarkdownEditor";

export const LeadsTalbe: FC<{
  data: {
    id: any;
    user_id: any;
    name: any;
    role: any;
    company: any;
    linkedin_url: any;
    created_at: any;
    message: any;
    status: any;
  }[] | undefined,
  onChangeLeadMessageStatus: Function,
  onChangeLeadMessageContent: Function,
  onDeleteLeadMessage: Function,
}> = ({
  data,
  onChangeLeadMessageStatus,
  onChangeLeadMessageContent,
  onDeleteLeadMessage,
}) => {
    return (
      <div>
        <div className="w-full flex justify-between gap-2 text-gray-400/90 font-medium py-2 border-b-[1px] border-gray-400/90">
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
          <div className={`w-full h-full flex flex-col justify-start gap-2 transition-all duration-500`}>
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
                onStatusChange={(status) => onChangeLeadMessageStatus({ id: item.id, status })}
                onDelete={() => onDeleteLeadMessage(item.id)}
                onMessageChange={(message) => {
                  onChangeLeadMessageContent({ id: item.id, message })
                }}
              ></Item>
            ))}
          </div>
        </div>
      </div>
    )
  };

const Item: FC<{
  name: string,
  role: string,
  company: string,
  linkedinURL: string,
  message: string,
  status: string,
  createdAt: Date,
  onStatusChange?: (status: string) => void,
  onMessageChange?: (message: string) => void,
  onDelete?: () => void,
}> = ({
  name,
  role,
  company,
  linkedinURL,
  message,
  status,
  createdAt,
  onStatusChange = () => { },
  onMessageChange = () => { },
  onDelete = () => { },
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
          <MarkdownEditor
            markdown={message}
            onMarkdownChange={onMessageChange}
          />
        </CollapsibleContent>
      </Collapsible>
    )
  }
