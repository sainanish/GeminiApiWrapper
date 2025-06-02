import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        // For simplicity, we'll assume text files or use the filename as content
        // In a real implementation, you'd use libraries like pdf-parse for PDFs
        resolve(result || `[${file.name}] - File content would be extracted here`);
      } else {
        resolve(`[${file.name}] - Binary file content extraction not implemented`);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    if (file.type.includes('text')) {
      reader.readAsText(file);
    } else {
      // For demo purposes, return file name and type
      resolve(`[${file.name}] - ${file.type} file uploaded successfully. In production, this would contain extracted text content.`);
    }
  });
}
