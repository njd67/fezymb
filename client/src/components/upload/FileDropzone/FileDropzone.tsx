import { useCallback, useRef, useState } from 'react';
import {
  ErrorText,
  FileItem,
  FileList,
  HiddenInput,
  Zone,
  ZoneHint,
  ZoneTitle,
} from './FileDropzone.styles';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
  maxSizeBytes?: number;
  disabled?: boolean;
}

export function FileDropzone({
  accept,
  multiple = false,
  files,
  onFilesChange,
  error,
  maxSizeBytes,
  disabled = false,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>();

  const validateAndSet = useCallback(
    (incoming: FileList | null) => {
      if (!incoming?.length) return;
      setLocalError(undefined);

      const list = Array.from(incoming);
      const accepted = accept.split(',').map((a) => a.trim().toLowerCase());

      for (const file of list) {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        const mimeOk = accepted.some(
          (a) => a === ext || a === file.type || (a.includes('/') && file.type === a),
        );
        if (!mimeOk && !accepted.includes(ext)) {
          setLocalError(`"${file.name}" is not an accepted file type.`);
          return;
        }
        if (maxSizeBytes && file.size > maxSizeBytes) {
          setLocalError(`"${file.name}" exceeds the size limit.`);
          return;
        }
      }

      onFilesChange(multiple ? list : [list[0]]);
    },
    [accept, maxSizeBytes, multiple, onFilesChange],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    validateAndSet(e.dataTransfer.files);
  };

  const displayError = error ?? localError;

  return (
    <div>
      <Zone
        $dragging={dragging}
        $hasError={!!displayError}
        $disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={disabled ? undefined : onDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click();
        }}
      >
        <ZoneTitle>{multiple ? 'Drop files here' : 'Drop your file here'}</ZoneTitle>
        <ZoneHint>or click to browse · {accept}</ZoneHint>
        <HiddenInput
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => validateAndSet(e.target.files)}
        />
      </Zone>
      {files.length > 0 && (
        <FileList>
          {files.map((f) => (
            <FileItem key={`${f.name}-${f.size}`}>
              <span>{f.name}</span>
              <span>{formatBytes(f.size)}</span>
            </FileItem>
          ))}
        </FileList>
      )}
      {displayError && <ErrorText>{displayError}</ErrorText>}
    </div>
  );
}
