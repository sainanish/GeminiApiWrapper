import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, Check, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  isUploaded?: boolean;
  isUploading?: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  required?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  isUploaded = false,
  isUploading = false,
  icon,
  title,
  description,
  required = false
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="text-blue-600 text-xl mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {required && <span className="ml-auto text-red-500 text-sm">*</span>}
      </div>
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer",
          isDragOver ? "border-blue-600 bg-blue-50" : "border-gray-300",
          isUploaded ? "border-green-300 bg-green-50" : "",
          "hover:border-blue-600"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {isUploading ? (
          <>
            <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-blue-600">Uploading...</p>
          </>
        ) : isUploaded ? (
          <>
            <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-600 font-medium">File uploaded successfully</p>
            <p className="text-xs text-gray-500 mt-1">Click to replace</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
    </div>
  );
}
