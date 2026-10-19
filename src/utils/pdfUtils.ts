/**
 * Convert a File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Convert base64 string to Blob URL for embedding
 */
export function base64ToBlobUrl(base64: string): string {
  // If it's already a data URL, return as is
  if (base64.startsWith('')) {
    return base64;
  }
  return `application/pdf;base64,${base64}`;
}

/**
 * Download a base64 PDF file
 */
export function downloadPdf(base64Data: string, filename: string) {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if a base64 string is a valid PDF
 */
export function isValidPdf(base64: string): boolean {
  return base64.startsWith('application/pdf') || 
         base64.startsWith(';base64,JVBERi');
}
