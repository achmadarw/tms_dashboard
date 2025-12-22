import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
    label?: string;
}

export default function TagInput({
    tags,
    onChange,
    suggestions = [],
    placeholder = 'Type and press Enter...',
    label,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = suggestions.filter(
        (s) =>
            s.toLowerCase().includes(inputValue.toLowerCase()) &&
            !tags.includes(s)
    );

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            onChange([...tags, trimmedTag]);
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const removeTag = (indexToRemove: number) => {
        onChange(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    return (
        <div className='space-y-2'>
            {label && (
                <label className='block text-sm font-medium text-gray-700'>
                    {label}
                </label>
            )}

            {/* Tags Display */}
            <div className='flex flex-wrap gap-2 mb-2'>
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm'
                    >
                        {tag}
                        <button
                            type='button'
                            onClick={() => removeTag(index)}
                            className='hover:bg-blue-200 rounded-full p-0.5'
                        >
                            <X className='h-3 w-3' />
                        </button>
                    </span>
                ))}
            </div>

            {/* Input */}
            <div className='relative'>
                <input
                    type='text'
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                    }
                    placeholder={placeholder}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />

                {/* Suggestions Dropdown */}
                {showSuggestions &&
                    inputValue &&
                    filteredSuggestions.length > 0 && (
                        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto'>
                            {filteredSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type='button'
                                    onClick={() => addTag(suggestion)}
                                    className='w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none'
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
            </div>

            <p className='text-xs text-gray-500'>
                Press Enter to add, click X to remove
            </p>
        </div>
    );
}
