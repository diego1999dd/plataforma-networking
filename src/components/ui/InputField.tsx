// src/components/ui/InputField.tsx

import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, ...props }) => {
  // Garantir que temos um ID para acessibilidade
  const inputId = props.id || name;

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          id={inputId}
          name={name}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...props}
        />
      </div>
    </div>
  );
};

export default InputField;
