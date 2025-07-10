'use client';

import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDraftMessage } from '../../_api';
import * as uuid from "uuid";
import { MultiModeGenerator, MultiModeGeneratorRef } from './MultiModeGenerator';
import { LeadMessage } from './_types/LeadMessage';
import { Shell } from './Shell';
import { SingleModeGeneratorRef, SingleModeGnerator } from './SingleModeGenerator';
import { EditForm } from './EditForm';
import { Mode } from './_types/Mode';

const Index: FC = memo(() => {
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [company, setCompany] = useState("");
	const [linkedinUrl, setLinkedinUrl] = useState("");

	const emptyEditForm = useCallback(() => {
		setName("");

		setRole("");

		setCompany("");

		setLinkedinUrl("");
	}, []);

	const isEditFormEmpty = useMemo(() => (
		name.trim() === ""
		&& role.trim() === ""
		&& company.trim() === ""
		&& linkedinUrl.trim() === ""
	), [name, role, company, linkedinUrl]);

	const isEditFormReady = useMemo(() => (
		name.trim() !== ""
		&& role.trim() !== ""
		&& company.trim() !== ""
	), [name, role, company]);

	const singleModeGeneratorRef = useRef<SingleModeGeneratorRef>(null);
	const [singleModeLeadMessage, setSingleModeLeadMessage] = useState<LeadMessage | null>(null);

	const genMsgForSingleMode = useCallback(() => {
		setSingleModeLeadMessage({
			id: uuid.v4(),
			name,
			role,
			company,
			linkedinUrl,
			message: "",
			isGenerating: false,
			isGenerateError: undefined,
			isDraftMessageReady: false
		});

		setTimeout(() => {
			singleModeGeneratorRef.current?.generateMessageByAI();
		}, 1);
	}, [name, role, company, linkedinUrl]);

	const multiModeGeneratorRef = useRef<MultiModeGeneratorRef>(null);
	const [multiModeLeadMessages, setMultiModeLeadMessages] = useState<LeadMessage[]>([]);
	const isMultiModeLeadMessagesGenerating = useMemo(() => multiModeLeadMessages.some(i => i.isGenerating), [multiModeLeadMessages]);
	const isMultiModeLeadMessagesDraftMessageReady = useMemo(() => multiModeLeadMessages.some(i => i.isDraftMessageReady), [multiModeLeadMessages]);

	const {
		mutateAsync: draftMessage,
		isPending: isDraftMessagePending,
		error: draftMessageError,
	} = useDraftMessage();

	const mode: Mode = useMemo(() => {
		if (singleModeLeadMessage) return "single";

		if (multiModeLeadMessages.length !== 0) return "multi";

		return undefined;
	}, [singleModeLeadMessage, multiModeLeadMessages]);

	const isAddIconShow = useMemo(() => mode !== "single" && isEditFormReady, [mode, isEditFormReady]);

	const isResetIconShow = useMemo(() => {
		if (!mode && isEditFormEmpty) return false;

		return true;
	}, [mode, isEditFormEmpty]);

	const isGenBtnLoading = useMemo(() => {
		if (
			mode === "single"
			&& singleModeLeadMessage!.isGenerating
		) return true;

		if (
			mode === "multi"
			&& isMultiModeLeadMessagesGenerating
		) return true;

		return false;
	}, [mode, singleModeLeadMessage, isMultiModeLeadMessagesGenerating])

	const isGenBtnDisabled = useMemo(() => {
		if (!mode && !isEditFormReady) return true;

		if (mode === "single" && !isEditFormReady) return true;

		if (mode === "single" && singleModeLeadMessage!.isGenerating) return true;

		if (mode === "multi" && isMultiModeLeadMessagesGenerating) return true;

		return false;
	}, [mode, isEditFormReady, singleModeLeadMessage, isMultiModeLeadMessagesGenerating]);

	const isSaveBtnShow = useMemo(() => {
		if (
			mode === "single"
			&& singleModeLeadMessage!.isDraftMessageReady
		) return true;

		if (
			mode === "multi"
			&& isMultiModeLeadMessagesDraftMessageReady
		) return true;

		return false;
	}, [mode, singleModeLeadMessage, isMultiModeLeadMessagesDraftMessageReady]);

	const isSaveBtnDisabled = useMemo(() => isDraftMessagePending, [isDraftMessagePending]);

	const saveError = useMemo(() => draftMessageError, [draftMessageError]);

	const handleAdd = useCallback(() => {
		setMultiModeLeadMessages(c => [
			...c,
			{
				id: uuid.v4(),
				name,
				role,
				company,
				linkedinUrl,
				message: "",
				isGenerating: false,
				isGenerateError: undefined,
				isDraftMessageReady: false,
			}
		]);
	}, [name, role, company, linkedinUrl]);

	const handleReset = useCallback(() => {
		emptyEditForm();

		setSingleModeLeadMessage(null);

		setMultiModeLeadMessages([]);
	}, [emptyEditForm]);

	const handleGen = useCallback(() => {
		if (mode === "single") {
			genMsgForSingleMode();
		}

		if (mode === "multi") {
			multiModeGeneratorRef.current?.generateMessageByAI();
		}

		if (mode === undefined) {
			genMsgForSingleMode()
		}
	}, [mode, genMsgForSingleMode]);

	const handleSave = useCallback(() => {
		if (mode === "single") {
			const {
				name,
				role,
				company,
				linkedinUrl,
				message
			} = singleModeLeadMessage!;

			draftMessage({
				name,
				role,
				company,
				linkedinUrl,
				message
			});
		}

		if (mode === "multi") {
			Promise.all(
				multiModeLeadMessages
					.map(i => draftMessage({
						name: i.name,
						role: i.role,
						company: i.company,
						linkedinUrl: i.linkedinUrl,
						message: i.message
					}))
			);
		}
	}, [mode, singleModeLeadMessage, multiModeLeadMessages]);

	const singleComponent = useMemo(() => singleModeLeadMessage && (
		<SingleModeGnerator
			ref={singleModeGeneratorRef}
			value={singleModeLeadMessage}
			onValueChange={setSingleModeLeadMessage}
		/>
	), [singleModeLeadMessage]);

	const multiModeComponent = useMemo(() => (
		<MultiModeGenerator
			ref={multiModeGeneratorRef}
			list={multiModeLeadMessages}
			onListChange={setMultiModeLeadMessages}
		/>
	), [multiModeLeadMessages]);

	const editFormComponent = useMemo(() => (
		<EditForm
			name={name} onNameChange={setName}
			role={role} onRoleChange={setRole}
			company={company} onCompanyChange={setCompany}
			linkedinUrl={linkedinUrl} onLinkedinUrlChange={setLinkedinUrl}
		/>
	), [name, role, company, linkedinUrl]);

	return (
		<Shell
			mode={mode}
			isAddIconShow={isAddIconShow}
			isResetIconShow={isResetIconShow}
			isGenBtnLoading={isGenBtnLoading}
			isGenBtnDisabled={isGenBtnDisabled}
			isSaveBtnShow={isSaveBtnShow}
			isSaveBtnLoading={isDraftMessagePending}
			isSaveBtnDisabled={isSaveBtnDisabled}
			saveError={saveError}
			onAdd={handleAdd}
			onReset={handleReset}
			onGen={handleGen}
			onSave={handleSave}
			singleModeComponent={singleComponent}
			multiModeComponent={multiModeComponent}
			editFormComponent={editFormComponent}
		/>
	);
});

export { Index as AddLeadForm };
