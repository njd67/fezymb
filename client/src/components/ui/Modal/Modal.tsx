import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Backdrop,
  Body,
  CloseButton,
  Header,
  Panel,
  ProgressFill,
  ProgressTrack,
  Title,
} from './Modal.styles';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  allowClose?: boolean;
  progress?: number;
  showHeader?: boolean;
  wide?: boolean;
  flushBody?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  closeOnBackdrop = false,
  allowClose = true,
  progress,
  showHeader = true,
  wide = false,
  flushBody = false,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && allowClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose, allowClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop && allowClose) {
      onClose();
    }
  };

  return createPortal(
    <Backdrop onClick={handleBackdropClick} role="presentation">
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title && showHeader ? 'modal-title' : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        $wide={wide}
      >
        {progress !== undefined && (
          <ProgressTrack aria-hidden>
            <ProgressFill $percent={progress} />
          </ProgressTrack>
        )}
        {showHeader && (title || allowClose) && (
          <Header>
            {title ? <Title id="modal-title">{title}</Title> : <span />}
            <CloseButton
              type="button"
              aria-label="Close"
              onClick={onClose}
              disabled={!allowClose}
            >
              ×
            </CloseButton>
          </Header>
        )}
        <Body $flush={flushBody}>{children}</Body>
      </Panel>
    </Backdrop>,
    document.body,
  );
}
