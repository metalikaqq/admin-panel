import React from 'react';
import {
  TextField as MuiTextField,
  TextFieldProps,
  FormControl,
  FormHelperText,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  InputLabel,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

interface InputFieldProps
  extends Omit<TextFieldProps, 'error' | 'label' | 'required'> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helpText,
  required,
  ...props
}) => {
  const hasError = !!error;

  return (
    <FormControl fullWidth margin="normal" error={hasError}>
      <Box mb={0.5}>
        <Typography
          component="label"
          variant="body2"
          fontWeight={500}
          color="textPrimary"
        >
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      </Box>
      <StyledTextField
        variant="outlined"
        fullWidth
        error={hasError}
        size="medium"
        required={required}
        {...props}
      />
      {(hasError || helpText) && (
        <FormHelperText error={hasError}>
          {hasError ? error : helpText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
