import React from 'react'

export interface ITextInputProps {
    title?: string;
    onChange?: (e:string) => any; 
    value?: string;
}
const TextInput: React.FC<ITextInputProps> = ({ title, onChange, value }) => {
    return (
        <div className="md:flex md:items-center mb-6">
            {
                title && <div className="md:w-1/5">
                    <label className="block text-gray-500  md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                        {title}
                    </label>
                </div>
            }

            <div className={`${title ? 'md:w-4/5' : 'md:w-full' }`}>
                <input onChange={e => {
                    onChange && onChange(e.target.value);
                }} value={value} className="appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white bg-white focus:border-blue-500" type="text" />
            </div>
        </div>
    )
}

export default TextInput
