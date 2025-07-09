'use client';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDraftMessage } from '../../_api';
import { useCompletion } from "@ai-sdk/react";
import { Plus, RotateCcw, Save, Sparkles } from "lucide-react";
import { InputItem } from '../Input/InputItem';
import { Button } from '../Button';
import { MarkdownEditor } from '../Input/MarkdownEditor/MarkdownEditor';
import { LeadMessageGeneratorList, LeadMessageGeneratorListRef } from './LeadMessageGeneratorList/LeadMessageGeneratorList';
import { LeadMessageForGenerator } from './LeadMessageGeneratorList/LeadMessageGenerator';
import * as uuid from "uuid";

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

	const isDraftMessageReady = useMemo(() => message.trim() !== "" && isGenerateReady && !isGenerating && !isGenerateError, [message, isGenerateReady, isGenerating, isGenerateError]);

	const reset = useCallback(() => {
		setName("");

		setRole("");

		setCompany("");

		setLinkedinUrl("");

		setMessage("");
	}, []);

	useEffect(() => {
		syncPrompt(`Write a short, friendly LinkedIn outreach message to ${name}, who is a ${role} at ${company}. Make it casual and under 500 characters.`)
	}, [name, role, company]);

	return {
		name, setName,
		role, setRole,
		company, setCompany,
		linkedinUrl, setLinkedinUrl,
		message, setMessage,
		isGenerating, isGenerateError, isGenerateReady, isDraftMessageReady,
		generateMessageByAI, reset
	};
};

export const AddLeadForm: FC = () => {
	const LeadMessageGeneratorListRef = useRef<LeadMessageGeneratorListRef>(null);

	const {
		name, setName,
		role, setRole,
		company, setCompany,
		linkedinUrl, setLinkedinUrl,
		message, setMessage,
		isGenerating, isGenerateError, isGenerateReady, isDraftMessageReady,
		generateMessageByAI, reset,
	} = useLeadMessage();

	const [leadMessages, setLeadMessages] = useState<LeadMessageForGenerator[]>([]);

	const leadMessagesForDraft = useMemo(() => leadMessages.map(item => {
		const { idx, isGenerating, isGenerateError, isDraftMessageReady, ...rest } = item;

		return rest;
	}), [leadMessages]);

	const {
		mutateAsync: draftMessage,
		isPending: isDraftMessagePending,
		isError: isDraftMessageError
	} = useDraftMessage();

	const isSingleGenerate = useMemo(() => leadMessages.length === 0, [leadMessages]);

	const isGenerateButtonDisabled = useMemo(() => {
		if (isSingleGenerate) {
			return !isGenerateReady || isGenerating;
		} else {
			return leadMessages.some(item => item.isGenerating);
		}
	}, [isSingleGenerate, isGenerateReady, isGenerating, leadMessages]);

	const isGenerateButtonLoading = useMemo(() => {
		if (isSingleGenerate) {
			return isGenerating;
		} else {
			return leadMessages.some(item => item.isGenerating);
		}
	}, [isSingleGenerate, isGenerating, leadMessages]);

	const isDraftMessageReadyR = useMemo(() => {
		if (isSingleGenerate) {
			return isDraftMessageReady;
		} else {
			return leadMessages.every(item => item.isDraftMessageReady);
		}
	}, [isSingleGenerate, isDraftMessageReady, leadMessages]);

	const handleAddButtonClick = useCallback(() => {
		setLeadMessages(c => [...c, {
			idx: uuid.v4(),
			name,
			role,
			company,
			linkedinUrl,
			message: "",
			isGenerating: false,
			isGenerateError: undefined,
			isDraftMessageReady: false
		}]);
	}, [name, role, company, linkedinUrl]);

	const handleReset = useCallback(() => {
		reset();

		setLeadMessages([]);
	}, [reset]);

	const handleGenerateMessageByAI = useCallback(async () => {
		if (isSingleGenerate) {
			generateMessageByAI();
		} else {
			LeadMessageGeneratorListRef.current?.generateMessageByAI();
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
				await Promise.all(leadMessagesForDraft.map(item => {
					return draftMessage(item);
				}));

				console.log("Batch draft message success");
			} catch (error) {
				console.error('Error saving batch leads:', error);

				return;
			}
		}
	}, [isSingleGenerate, leadMessagesForDraft, draftMessage, name, role, company, linkedinUrl, message]);

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
				<div className='flex gap-2'>
					{
						(message !== "" || leadMessages.length !== 0)
							? (
								<RotateCcw
									className='text-gray-800 hover:text-gray-600 cursor-pointer'
									onClick={handleReset}
								/>
							)
							: null
					}
					{
						isGenerateReady
							? (
								<Plus
									className="text-green-600 hover:text-green-500 cursor-pointer transition-all"
									onClick={handleAddButtonClick}
								/>

							)
							: null
					}
				</div>


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
			<LeadMessageGeneratorList
				ref={LeadMessageGeneratorListRef}
				leadMessages={leadMessages}
				onLeadMessagesChange={setLeadMessages}
			/>
			{
				isGenerateError
					? <div className='text-red-800'>Some error happened when generate message, please try again later.</div>
					: <MarkdownEditor
						markdown={message}
						onMarkdownChange={setMessage}
					/>
			}
			{isDraftMessageReadyR ? (
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


