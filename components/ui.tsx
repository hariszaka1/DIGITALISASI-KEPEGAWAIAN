import React, { useState, ReactNode } from 'react';
import { PlusCircleIcon, TrashIcon } from './icons';

export const Card: React.FC<{ children: ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {title && <h2 className="text-xl font-bold text-dark mb-4 border-b pb-2">{title}</h2>}
    {children}
  </div>
);

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
export const InputField: React.FC<InputFieldProps> = ({ label, id, error, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={id}
      {...props}
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
    />
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options?: string[];
  error?: string;
  children?: ReactNode;
}
export const SelectField: React.FC<SelectFieldProps> = ({ label, id, options, error, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      id={id}
      {...props}
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
    >
      {children || (
          <>
            <option value="">Pilih...</option>
            {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </>
      )}
    </select>
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}
export const TextAreaField: React.FC<TextAreaProps> = ({ label, id, error, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      id={id}
      {...props}
      rows={4}
      className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
    />
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
  </div>
);

interface FileUploadProps {
  label: string;
  id: string;
  onChange: (file: File | null) => void;
  previewUrl?: string;
}
export const FileUpload: React.FC<FileUploadProps> = ({ label, id, onChange, previewUrl }) => {
  const [internalPreview, setInternalPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInternalPreview(URL.createObjectURL(file));
      onChange(file);
    } else {
      setInternalPreview(null);
      onChange(null);
    }
  };

  const currentPreview = internalPreview || previewUrl;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="mt-1 flex items-center space-x-4">
        {currentPreview && (
          <img src={currentPreview} alt="Preview" className="h-24 w-auto object-cover rounded-md border" />
        )}
        <div className="flex text-sm text-gray-600">
          <label htmlFor={id} className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-secondary">
            <span>Upload file</span>
            <input id={id} name={id} type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
          </label>
        </div>
      </div>
    </div>
  );
};

export const Button: React.FC<{ children: ReactNode; onClick?: () => void; type?: 'button' | 'submit' | 'reset'; variant?: 'primary' | 'secondary' | 'danger'; className?: string, disabled?: boolean }> = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled=false }) => {
    const baseClasses = 'px-4 py-2 rounded-md font-semibold text-white shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClasses = {
        primary: 'bg-primary hover:bg-blue-900 focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-600',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-600',
    };

    return (
        <button type={type} onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`} disabled={disabled}>
            {children}
        </button>
    );
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-dark">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div className="p-6">{children}</div>
                {footer && <div className="p-4 border-t flex justify-end space-x-2">{footer}</div>}
            </div>
        </div>
    );
};


interface MultiInputProps {
    label: string;
    values: { id: string, nama: string }[];
    onChange: (values: { id: string, nama: string }[]) => void;
}

export const MultiInputField: React.FC<MultiInputProps> = ({ label, values, onChange }) => {
    
    const handleAdd = () => {
        onChange([...values, { id: `new-${Date.now()}`, nama: '' }]);
    };

    const handleRemove = (idToRemove: string) => {
        onChange(values.filter(v => v.id !== idToRemove));
    };

    const handleChange = (id: string, newName: string) => {
        onChange(values.map(v => (v.id === id ? { ...v, nama: newName } : v)));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="space-y-2">
                {values.map((value) => (
                    <div key={value.id} className="flex items-center space-x-2">
                        <InputField
                            label=""
                            value={value.nama}
                            onChange={(e) => handleChange(value.id, e.target.value)}
                            className="flex-grow"
                            placeholder="Nama Anak"
                        />
                        <button type="button" onClick={() => handleRemove(value.id)} className="p-2 text-red-500 hover:text-red-700">
                           <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={handleAdd} className="mt-2 flex items-center text-sm text-secondary hover:text-primary">
                <PlusCircleIcon className="w-5 h-5 mr-1" />
                Tambah Anak
            </button>
        </div>
    );
};