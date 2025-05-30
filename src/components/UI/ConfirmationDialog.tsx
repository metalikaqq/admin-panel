import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Box,
} from '@mui/material';
import { Button } from './Button';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'success';
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          padding: '12px',
          minWidth: { xs: '80%', sm: '400px' },
        },
      }}
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pt: 2, px: 3, pb: 2 }}>
        <Box display="flex" gap={2} width="100%" justifyContent="flex-end">
          <Button
            label={cancelLabel}
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          />
          <Button
            label={confirmLabel}
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
            autoFocus
          />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
