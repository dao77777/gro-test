'use client';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDraftMessage } from '../_api';
import { useCompletion } from "@ai-sdk/react";
import { Save, Sparkles } from "lucide-react";
import { InputItem } from './InputItem';
import { Button } from './Button';
import { MessageContainer } from './MessageContainer';

const useLeadMessage = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const {
    completion: message,
    setInput: syncPrompt,
    handleSubmit: generateMessageByAI,
    isLoading: isGenerating,
    error: isGenerateError,
    setCompletion: setMessage
  } = useCompletion({ api: "/api/generate-message" })

  const isGenerateReady = useMemo(() => name.trim() !== "" && role.trim() !== "" && company.trim() !== "", [name, role, company]);

  const isDraftMessageReady = useMemo(() => message.trim() !== "" && isGenerateReady && !isGenerating && !isGenerateError, [message, isGenerateReady, isGenerating, isGenerateError])

  useEffect(() => {
    syncPrompt(`Write a short, friendly LinkedIn outreach message to ${name}, who is a ${role} at ${company}. Make it casual and under 500 characters.`)
  }, [name, role, company]);

  return {
    name, setName,
    role, setRole,
    company, setCompany,
    linkedinUrl, setLinkedinUrl,
    message, setMessage,
    generateMessageByAI,
    isGenerating,
    isGenerateError,
    isGenerateReady,
    isDraftMessageReady
  };
};

export const AddLeadForm: FC = () => {
  const {
    name, setName,
    role, setRole,
    company, setCompany,
    linkedinUrl, setLinkedinUrl,
    message, setMessage,
    generateMessageByAI,
    isGenerating,
    isGenerateError,
    isGenerateReady,
    isDraftMessageReady
  } = useLeadMessage();

  const {
    mutateAsync: draftMessage,
    isPending: isDraftMessagePending,
    isError: isDraftMessageError
  } = useDraftMessage();

  const handleGenerateMessageByAI = useCallback(async () => {
    generateMessageByAI();
  }, [generateMessageByAI]);

  const handleDraftMessage = useCallback(async () => {


    try {
      await draftMessage({
        name,
        role,
        company,
        linkedinUrl,
        message
      });
      console.log("Draft message success");
    } catch (error) {
      console.error('Error saving lead:', error);
      return;
    }
  }, [draftMessage, name, role, company, linkedinUrl, message]);

  return (
    <div className="
    shadow-sm hover:shadow-lg rounded-xs border border-gray-200 w-[600px] p-4 
    flex flex-col items-stretch gap-4
    transition-all
    ">
      <div className='flex flex-col items-start gap-2'>
        <h1 className="text-2xl text-gray-800 font-bold flex items-center gap-2">
          <Sparkles className="text-blue-600" />
          Add New Lead
        </h1>
        <p className="text-sm text-gray-600">Enter lead information and generate a personalized outreach message</p>
      </div>
      <div className='flex justify-between gap-4'>
        <div className='grow'><InputItem
          value={name}
          onChange={setName}
          label="Name"
          placeholder="John Doe"
          require
        /></div>
        <div className='grow'><InputItem
          value={role}
          onChange={setRole}
          label="Role"
          placeholder="Marketing Director"
          require
        /></div>
      </div>
      <InputItem
        value={company}
        onChange={setCompany}
        label="Company"
        placeholder="Microsoft Inc"
        require
      />
      <InputItem
        value={linkedinUrl}
        onChange={setLinkedinUrl}
        label="LinkedIn URL"
        placeholder="https://linkedin.com/in/johndoe"
      />
      <Button
        onClick={handleGenerateMessageByAI}
        disabled={!isGenerateReady || isGenerating}
        loading={isGenerating}
      ><div className="flex items-center justify-center gap-2">
          <Sparkles size={16} />
          Generate Message
        </div></Button>
      {
        isGenerateError ? <div className='text-red-800'>Some error happened when generate message, please try again later.</div> : <MessageContainer generateMessage={message} />
      }
      {isDraftMessageReady ? (
        <Button
          className='bg-green-900 hover:bg-green-800'
          onClick={handleDraftMessage}
          loading={isDraftMessagePending}
          disabled={isDraftMessagePending}
        ><div className='flex items-center gap-2'>
            <Save size={16} />
            Save
          </div></Button>
      ) : null}
      {
        isDraftMessageError ? <div className='text-red-800'>Some error happened when save message, please try again later.</div> : null
      }
    </div>
  );
}
