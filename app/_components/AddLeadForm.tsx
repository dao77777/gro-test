'use client';

import { FC, Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useDraftMessage } from '../_api';
import { useCompletion } from "@ai-sdk/react";
import { Plus, RotateCcw, Save, Sparkles } from "lucide-react";
import { InputItem } from './InputItem';
import { Button } from './Button';
import { MarkdownEditor } from './MarkdownEditor';
import { LeadMessageDisplay } from './LeadMessageDisplay';

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

  const [batchLeadMessages, setBatchLeadMessages] = useState<{
    name: string,
    role: string,
    company: string,
    linkedinUrl: string,
    message: string,
    isGenerating: boolean,
    isGenerateError: Error | undefined,
    isDraftMessageReady: boolean
  }[]>([]);

  const handleSetBatchLeadMessageContent = (idx: number) => {
    return (message: string) => {
      setBatchLeadMessages(c => {
        const newBatch = [...c];
        newBatch[idx].message = message;
        return newBatch;
      });
    }
  }

  const handleSetBatchLeadMessageGenerating = (idx: number) => {
    return (isGenerating: boolean) => {
      setBatchLeadMessages(c => {
        const newBatch = [...c];
        newBatch[idx].isGenerating = isGenerating;
        return newBatch;
      });
    }
  }

  const handleSetBatchLeadMessageGenerateError = (idx: number) => {
    return (isGenerateError: Error | undefined) => {
      setBatchLeadMessages(c => {
        const newBatch = [...c];
        newBatch[idx].isGenerateError = isGenerateError;
        return newBatch;
      });
    }
  }

  const handleSetBatchLeadMessageDraftReady = (idx: number) => {
    return (isDraftMessageReady: boolean) => {
      setBatchLeadMessages(c => {
        const newBatch = [...c];
        newBatch[idx].isDraftMessageReady = isDraftMessageReady;
        return newBatch;
      });
    }
  }

  const batchLeadMessagesRef = useRef<LeadMessageEditorRef[]>([]);

  const handleAddButtonClick = useCallback(() => {
    setBatchLeadMessages(c => [...c, {
      name,
      role,
      company,
      linkedinUrl,
      message: "",
      isGenerating: false,
      isGenerateError: undefined,
      isDraftMessageReady: false
    }])
  }, [name, role, company, linkedinUrl]);

  const isSingleGenerate = useMemo(() => batchLeadMessages.length === 0, [batchLeadMessages]);

  const handleResetBatchLeadMessages = useCallback(() => {
    setMessage("");
    setBatchLeadMessages([]);
    batchLeadMessagesRef.current = [];
  }, []);

  const handleGenerateMessageByAI = useCallback(async () => {
    if (isSingleGenerate) {
      generateMessageByAI();
    } else {
      batchLeadMessagesRef.current.forEach(item => {
        item.generateMessageByAI();
      })
    }
  }, [isSingleGenerate, generateMessageByAI]);

  const handleDraftMessage = useCallback(async () => {
    if (isSingleGenerate) {
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
    } else {
      try {
        await Promise.all(batchLeadMessages.map(item => {
          return draftMessage({
            name: item.name,
            role: item.role,
            company: item.company,
            linkedinUrl: item.linkedinUrl,
            message: item.message
          });
        }));
        console.log("Batch draft message success");
      } catch (error) {
        console.error('Error saving batch leads:', error);
        return;
      }
    }
  }, [isSingleGenerate, batchLeadMessages, draftMessage, name, role, company, linkedinUrl, message]);

  const isGenerateButtonDisabled = useMemo(() => {
    if (isSingleGenerate) {
      return !isGenerateReady || isGenerating;
    } else {
      return batchLeadMessages.some(item => item.isGenerating);
    }
  }, [isSingleGenerate, isGenerateReady, isGenerating, batchLeadMessages]);

  const isGenerateButtonLoading = useMemo(() => {
    if (isSingleGenerate) {
      return isGenerating;
    } else {
      return batchLeadMessages.some(item => item.isGenerating);
    }
  }, [isSingleGenerate, isGenerating, batchLeadMessages]);

  const rIsDraftMessageReady = useMemo(() => {
    if (isSingleGenerate) {
      return isDraftMessageReady;
    } else {
      return batchLeadMessages.every(item => item.isDraftMessageReady);
    }
  }, [isSingleGenerate, isDraftMessageReady, batchLeadMessages]);

  return (
    <div className="
    shadow-sm hover:shadow-lg rounded-xs border border-gray-200 w-[600px] p-4 
    flex flex-col items-stretch gap-4
    transition-all
    ">
      <div className="flex justify-between">
        <div className='flex flex-col items-start gap-2'>
          <h1 className="text-2xl text-gray-800 font-bold flex items-center gap-2">
            <Sparkles className="text-blue-600" />
            Add New Lead
          </h1>
          <p className="text-sm text-gray-600">Enter lead information and generate a personalized outreach message</p>
        </div>
        {
          isGenerateReady
            ? (
              <div className='flex gap-2'>
                <RotateCcw
                  className='text-gray-800 hover:text-gray-600 cursor-pointer'
                  onClick={handleResetBatchLeadMessages}
                />
                <Plus
                  className="text-green-600 hover:text-green-500 cursor-pointer transition-all"
                  onClick={handleAddButtonClick}
                />
              </div>

            )
            : null
        }
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
        disabled={isGenerateButtonDisabled}
        loading={isGenerateButtonLoading}
      ><div className="flex items-center justify-center gap-2">
          <Sparkles size={16} />
          Generate Message
        </div></Button>
      {
        batchLeadMessages.map((item, idx) => (
          <LeadMessageEditor
            key={idx}
            ref={el => {
              if (el) {
                batchLeadMessagesRef.current[idx] = el;
              }
            }}
            name={item.name}
            role={item.role}
            company={item.company}
            linkedinUrl={item.linkedinUrl}
            onMessageChange={handleSetBatchLeadMessageContent(idx)}
            onIsGeneratingChange={handleSetBatchLeadMessageGenerating(idx)}
            onIsGenerateErrorChange={handleSetBatchLeadMessageGenerateError(idx)}
            onIsDraftMessageReadyChange={handleSetBatchLeadMessageDraftReady(idx)}
          />
        ))
      }
      {
        isGenerateError
          ? <div className='text-red-800'>Some error happened when generate message, please try again later.</div>
          : <MarkdownEditor
            markdown={message}
            onSubmit={setMessage}
          />
      }
      {rIsDraftMessageReady ? (
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


export type LeadMessageEditorRef = {
  generateMessageByAI: () => void,
}

const LeadMessageEditor: FC<{
  ref?: Ref<LeadMessageEditorRef>,
  name: string,
  role: string,
  company: string,
  linkedinUrl: string,
  onMessageChange?: (message: string) => void,
  onIsGeneratingChange?: (isGenerating: boolean) => void,
  onIsGenerateErrorChange?: (isGenerateError: Error | undefined) => void,
  onIsDraftMessageReadyChange?: (isDraftMessageReady: boolean) => void,
  className?: string,
}> = ({
  ref,
  name = "",
  role = "",
  company = "",
  linkedinUrl = "",
  onMessageChange = () => { },
  onIsGeneratingChange = () => { },
  onIsGenerateErrorChange = () => { },
  onIsDraftMessageReadyChange = () => { },
  className = ""
}) => {
    const {
      name: rName, setName,
      role: rRole, setRole,
      company: rCompany, setCompany,
      linkedinUrl: rLinkedinUrl, setLinkedinUrl,
      message, setMessage,
      generateMessageByAI,
      isGenerating,
      isGenerateError,
      isGenerateReady,
      isDraftMessageReady
    } = useLeadMessage();

    const handleMarkdownEditorSubmit = useCallback((message: string) => {
      setMessage(message);
      onMessageChange(message);
    }, [setMessage, onMessageChange]);

    useEffect(() => {
      setName(name);
      setRole(role);
      setCompany(company);
      setLinkedinUrl(linkedinUrl);
      onIsGeneratingChange(isGenerating);
      onIsGenerateErrorChange(isGenerateError);
      onIsDraftMessageReadyChange(isDraftMessageReady);
    }, [name, role, company, linkedinUrl, isGenerating, isGenerateError, isDraftMessageReady]);

    useImperativeHandle(ref, () => ({
      generateMessageByAI,
    }), [])

    return (
      <div className="flex items-start gap-2 p-2 bg-gray-200 rounded-xs">
        <LeadMessageDisplay
          className="w-1/3!"
          classNameForKey="text-gray-800 font-bold"
          classNameForValue="text-gray-600!"
          name={name}
          role={role}
          company={company}
        />
        {
          isGenerateError
            ? <div className='text-red-800'>Some error happened when generate message, please try again later.</div>
            : <MarkdownEditor
              className="w-2/3!"
              classNameForEditor="border! border-gray-800! bg-white!"
              markdown={message}
              onSubmit={handleMarkdownEditorSubmit}
            />
        }
      </div>
    )
  }