import React, { useRef } from 'react';

export default function DocumentUploader({
    onUpload,
}: {
    onUpload: (files: FileList) => void;
}) {
    const fileInput = useRef<HTMLInputElement>(null);
    return (
        <div
            className='border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400'
            onClick={() => fileInput.current?.click()}
        >
            <input
                type='file'
                multiple
                ref={fileInput}
                className='hidden'
                onChange={(e) => e.target.files && onUpload(e.target.files)}
            />
            <span className='text-gray-500'>
                Drag & drop or click to upload documents
            </span>
        </div>
    );
}
