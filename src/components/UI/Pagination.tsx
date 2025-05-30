'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PageButton = styled(Button)<{ selected: boolean }>(
  ({ theme, selected }) => ({
    minWidth: '36px',
    height: '36px',
    padding: '4px 8px',
    margin: '0 4px',
    borderRadius: '4px',
    fontWeight: selected ? 'bold' : 'normal',
    backgroundColor: selected ? theme.palette.primary.main : 'transparent',
    color: selected ? '#fff' : theme.palette.text.primary,
    '&:hover': {
      backgroundColor: selected
        ? theme.palette.primary.dark
        : theme.palette.action.hover,
    },
  })
);

const ArrowButton = styled(Button)(({ theme }) => ({
  minWidth: '36px',
  height: '36px',
  padding: '4px',
  margin: '0 4px',
  borderRadius: '4px',
  '&.Mui-disabled': {
    color: theme.palette.action.disabled,
  },
}));

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Get array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxButtons = 5; // Maximum number of page buttons to show

    if (totalPages <= maxButtons) {
      // Show all pages if less than or equal to maxButtons
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page
      pageNumbers.push(1);

      // Add ... if necessary
      if (currentPage > 3) {
        pageNumbers.push('...');
      }

      // Add current page and surrounding pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pageNumbers.push(i);
        }
      }

      // Add ... if necessary
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }

      // Show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <PaginationContainer>
      <ArrowButton disabled={currentPage === 1} onClick={() => onPageChange(1)}>
        <KeyboardDoubleArrowLeftIcon />
      </ArrowButton>

      <ArrowButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <NavigateBeforeIcon />
      </ArrowButton>

      {getPageNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <PageButton
            key={index}
            onClick={() => onPageChange(page)}
            selected={page === currentPage}
          >
            {page}
          </PageButton>
        ) : (
          <Typography
            key={index}
            variant="body2"
            component="span"
            sx={{ mx: 1 }}
          >
            {page}
          </Typography>
        )
      )}

      <ArrowButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <NavigateNextIcon />
      </ArrowButton>

      <ArrowButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        <KeyboardDoubleArrowRightIcon />
      </ArrowButton>
    </PaginationContainer>
  );
};
