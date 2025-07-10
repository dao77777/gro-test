import { Plus, RotateCcw, Save, Sparkles } from "lucide-react";
import { FC, memo, ReactNode } from "react";
import { Button } from "../Button";
import { Mode } from "./_types/Mode";
import { AnimatePresence, motion } from "framer-motion";

export const Shell: FC<{
    mode: Mode,
    isResetIconShow: boolean,
    isAddIconShow: boolean,
    isGenBtnLoading: boolean,
    isGenBtnDisabled: boolean,
    isSaveBtnShow: boolean,
    isSaveBtnLoading: boolean,
    isSaveBtnDisabled: boolean,
    saveError: Error | null,
    onAdd: () => void,
    onReset: () => void,
    onGen: () => void,
    onSave: () => void,
    singleModeComponent: ReactNode,
    multiModeComponent: ReactNode,
    editFormComponent: ReactNode,
}> = memo(({
    mode,
    isResetIconShow,
    isAddIconShow,
    isGenBtnLoading,
    isGenBtnDisabled,
    isSaveBtnShow,
    isSaveBtnLoading,
    isSaveBtnDisabled,
    saveError,
    onAdd,
    onReset,
    onGen,
    onSave,
    singleModeComponent,
    multiModeComponent,
    editFormComponent
}) => {
    return (
        <div
            className="
			shadow-sm hover:shadow-lg rounded-xs border border-gray-200 w-[600px] p-4
			flex flex-col items-stretch gap-4
			transition-all
			"
        >
            <Header
                isResetIconShow={isResetIconShow}
                isAddIconShow={isAddIconShow}
                onReset={onReset}
                onAdd={onAdd}
            />
            {editFormComponent}
            <GenBtn
                onGen={onGen}
                isGenBtnLoading={isGenBtnLoading}
                isGenBtnDisabled={isGenBtnDisabled}
            />
            {mode && <hr />}
            {mode === "single" && singleModeComponent}
            {mode === "multi" && multiModeComponent}
            {isSaveBtnShow && (
                <SaveBtn
                    onSave={onSave}
                    isSaveBtnLoading={isSaveBtnLoading}
                    isSaveBtnDisabled={isSaveBtnDisabled}
                />
            )}
            {saveError && <div className='text-red-800'>Some error happened when save message, please try again later.</div>}
        </div>
    );
});

const Header: FC<{
    isResetIconShow: boolean,
    isAddIconShow: boolean,
    onReset: () => void,
    onAdd: () => void
}> = memo(({
    isResetIconShow,
    isAddIconShow,
    onReset,
    onAdd
}) => (
    <div className="flex justify-between">
        <div className='flex flex-col items-start gap-2'>
            <h1 className="text-2xl text-gray-800 font-medium flex items-center gap-2">
                <Sparkles className="text-blue-600" />
                Add New Lead
            </h1>
            <p className="text-sm text-gray-400">Enter lead information and generate a personalized outreach message</p>
        </div>
        <div className='flex gap-2'><AnimatePresence mode="popLayout">
            {isResetIconShow && (
                <motion.div
                    key="reset"
                    layoutId="reset"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.24 }}
                >
                    <RotateCcw
                        className="text-gray-800 hover:text-gray-600 cursor-pointer"
                        onClick={onReset}
                    />
                </motion.div>
            )}
            {isAddIconShow && (
                <motion.div
                    key="add"
                    layoutId="add"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.24 }}
                >
                    <Plus
                        className="text-green-600 hover:text-green-500 cursor-pointer transition-all"
                        onClick={onAdd}
                    />
                </motion.div>
            )}
        </AnimatePresence></div>
    </div>
));

const GenBtn: FC<{
    onGen: () => void,
    isGenBtnLoading: boolean,
    isGenBtnDisabled: boolean
}> = memo(({
    onGen,
    isGenBtnLoading,
    isGenBtnDisabled
}) => (
    <Button
        onClick={onGen}
        disabled={isGenBtnDisabled}
        loading={isGenBtnLoading}
        classNameForContent="flex items-center justify-center gap-2"
    >
        <Sparkles size={16} />
        Generate Message
    </Button>
));

const SaveBtn: FC<{
    onSave: () => void,
    isSaveBtnLoading: boolean,
    isSaveBtnDisabled: boolean
}> = memo(({
    onSave,
    isSaveBtnLoading,
    isSaveBtnDisabled
}) => (
    <Button
        className='bg-green-900 hover:bg-green-800'
        classNameForDisabled="saturate-50 hover:bg-green-900!"
        classNameForContent="flex items-center gap-2"
        onClick={onSave}
        loading={isSaveBtnLoading}
        disabled={isSaveBtnDisabled}
    >
        <Save size={16} />
        Save
    </Button>
));