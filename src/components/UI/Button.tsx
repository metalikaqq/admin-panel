import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
  Typography
} from '@mui/material';

// Custom styled button with different variants
const StyledButton = styled(MuiButton)<{ customvariant: 'primary' | 'secondary' | 'danger' | 'success' }>(
  ({ theme, customvariant }) => ({
    borderRadius: '8px',
    padding: '10px 24px',
    fontWeight: 500,
    textTransform: 'none',
    boxShadow: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    ...(customvariant === 'primary' && {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
    ...(customvariant === 'secondary' && {
      backgroundColor: theme.palette.secondary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
    }),
    ...(customvariant === 'danger' && {
      backgroundColor: theme.palette.error.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
      },
    }),
    ...(customvariant === 'success' && {
      backgroundColor: theme.palette.success.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.success.dark,
      },
    }),
  })
);

interface CustomButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  label: string;
  loading?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<CustomButtonProps> = ({
  label,
  loading = false,
  icon,
  variant = 'primary',
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      customvariant={variant}
      disabled={!!(loading || disabled)}
      startIcon={loading ? undefined : icon}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
          <Typography component="span">Loading...</Typography>
        </>
      ) : (
        label
      )}
    </StyledButton>
  );
};
