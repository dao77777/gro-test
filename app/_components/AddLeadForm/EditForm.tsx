import { FC, memo } from "react"
import { InputItem } from "../Input/InputItem"

export const EditForm: FC<{
    name: string, onNameChange: (name: string) => void,
    role: string, onRoleChange: (role: string) => void,
    company: string, onCompanyChange: (company: string) => void,
    linkedinUrl: string, onLinkedinUrlChange: (linkedinUrl: string) => void
}> = memo(({
    name, onNameChange,
    role, onRoleChange,
    company, onCompanyChange,
    linkedinUrl, onLinkedinUrlChange
}) => (
    <div className="flex flex-col gap-4">
        <div className='flex justify-between gap-4'>
            <div className='grow'><InputItem
                value={name}
                onChange={onNameChange}
                label="Name"
                placeholder="John Doe"
                require
            /></div>
            <div className='grow'><InputItem
                value={role}
                onChange={onRoleChange}
                label="Role"
                placeholder="Marketing Director"
                require
            /></div>
        </div>
        <InputItem
            value={company}
            onChange={onCompanyChange}
            label="Company"
            placeholder="Microsoft Inc"
            require
        />
        <InputItem
            value={linkedinUrl}
            onChange={onLinkedinUrlChange}
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/johndoe"
        />
    </div>
));