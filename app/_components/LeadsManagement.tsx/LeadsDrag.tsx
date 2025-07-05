"use client";

import { FC, ReactNode, useMemo } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core"
import { motion } from "framer-motion";
import { useChangeLeadMessageStatus, useDeleteLeadMessage, useLeadMessages } from "../../_api";

export const LeadsDrag: FC<{
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
  onDeleteLeadMessage: Function
}> = ({
  data,
  onChangeLeadMessageStatus,
  onDeleteLeadMessage
}) => {
    const draftLeadsMessages = useMemo(() => data?.filter(i => i.status === "draft"), [data]);

    const approvedLeadsMessages = useMemo(() => data?.filter(i => i.status === "approved"), [data]);

    const sentLeadsMessages = useMemo(() => data?.filter(i => i.status === "sent"), [data]);

    const handleDragEnd = (e: DragEndEvent) => {
      const activeId = e.active.id.toString();

      const overId = e.over?.id.toString();

      if (overId && overId === "draft") {
        if (data?.find(i => i.id === activeId && i.status === "draft")) return;

        onChangeLeadMessageStatus({ id: activeId, status: "draft" });
      } else if (overId && overId === "approved") {
        if (data?.find(i => i.id === activeId && i.status === "approved")) return;

        onChangeLeadMessageStatus({ id: activeId, status: "approved" });
      } else if (overId && overId === "sent") {
        if (data?.find(i => i.id === activeId && i.status === "sent")) return;

        onChangeLeadMessageStatus({ id: activeId, status: "sent" });
      } else if (overId && overId === "delete") {
        onDeleteLeadMessage(activeId);
      }
    }

    return (
      <DndContext onDragEnd={handleDragEnd}><div className="flex flex-col gap-8">
        <div className="flex gap-8">
          <DropContainer
            id="draft"
            title="Draft"
            description="Draft LeadMessages"
            className="relative"
          >
            {draftLeadsMessages && draftLeadsMessages.map(i => (
              <DragItem
                key={i.id}
                id={i.id}
                name={i.name}
                role={i.role}
                company={i.company}
              />
            ))}
          </DropContainer>
          <DropContainer
            id="approved"
            title="Approved"
            description="Approved LeadMessages"
          >
            {approvedLeadsMessages && approvedLeadsMessages.map(i => (
              <DragItem
                key={i.id}
                id={i.id}
                name={i.name}
                role={i.role}
                company={i.company}
              />
            ))}
          </DropContainer>
          <DropContainer
            id="sent"
            title="Sent"
            description="Sent LeadMessages"
          >
            {sentLeadsMessages && sentLeadsMessages.map(i => (
              <DragItem
                key={i.id}
                id={i.id}
                name={i.name}
                role={i.role}
                company={i.company}
              />
            ))}
          </DropContainer>
        </div>
        <Droppable
          id="delete"
          className="
          shadow-sm border border-gray-100 rounded-xs h-20
          flex items-center justify-center text-red-100 font-bold text-lg
          transition-all
          "
          classNameWhenOver="text-red-400"
        >Drag Here To Delete LeadMessage</Droppable>
      </div></DndContext>
    )
  }

const DropContainer: FC<{
  id: string,
  title: string,
  description: string,
  children: ReactNode,
  className?: string
}> = ({
  id,
  title,
  description,
  children,
  className
}) => {
    return (
      <Droppable
        id={id}
        className={`
        shadow border border-gray-100 w-[300px] h-[600px] p-2
        flex flex-col flex-start gap-4
        ${className}
        `}
      >
        <div>
          <h1 className="text-lg text-gray-400 font-bold">{title}</h1>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
        <div className="w-full flex flex-col items-center gap-2">
          {children}
        </div>
      </Droppable>
    )
  }

const DragItem: FC<{
  id: string,
  name: string,
  role: string,
  company: string,
  className?: string
}> = ({
  id,
  name,
  role,
  company,
  className = ""
}) => {
    return (
      <Draggable
        id={id}
        className={`
        shadow-sm border border-gray-100 rounded-xs w-full p-2
        flex flex-col items-start justify-between text-xs bg-white cursor-grab
        ${className}
        `}
      >
        <div className="flex gap-2">
          <span className="w-16 font-bold text-gray-300">Name</span>{name}
        </div>
        <div className="flex gap-2">
          <span className="w-16 font-bold text-gray-300">Role</span>{role}
        </div>
        <div className="flex gap-2">
          <span className="w-16 font-bold text-gray-300">Name</span>{company}
        </div>
      </Draggable>
    )
  };

const Draggable: FC<{ id: string, children: ReactNode, className?: string }> = ({ id, children, className = "" }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      layoutId={id}
      drag
      dragSnapToOrigin
      {...listeners}
      {...attributes}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Droppable: FC<{
  id: string,
  children: ReactNode,
  className?: string,
  classNameWhenOver?: string

}> = ({
  id,
  children,
  className = "",
  classNameWhenOver = ""
}) => {
    const { isOver, setNodeRef } = useDroppable({ id });

    return (
      <div
        ref={setNodeRef}
        className={`${isOver ? classNameWhenOver : ""} ${className}`}
      >
        {children}
      </div>
    );
  }