'use client';

import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  StepContent,
  StepIconProps,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ImageIcon from '@mui/icons-material/Image';
import { styled } from '@mui/material/styles';
import ProductTypeSelector from '../ProductTypeSelector/ProductTypeSelector';
import ProductInfo from '../ProductInfo/ProductInfo';
import ProductImage from '../ProductImage/ProductImage';
import { useProductStore } from '@/store/useProductStore';
import { isFormValid } from '../ProductInfo/validation';

// Custom step icon
const ColorlibStepIcon = (props: StepIconProps) => {
  const { active, completed, className, icon } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <InfoIcon />,
    2: <ImageIcon />,
    3: <CheckCircleIcon />,
  };

  return (
    <Box
      sx={{
        backgroundColor: completed
          ? '#4caf50'
          : active
            ? '#1976d2'
            : '#ccc',
        color: '#fff',
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className={className}
    >
      {icons[String(icon)]}
    </Box>
  );
};

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

// Steps definitions
const steps = [
  {
    label: 'Product Type',
    description: 'Select the product type',
  },
  {
    label: 'Product Information',
    description: 'Enter product details',
  },
  {
    label: 'Product Images',
    description: 'Upload product images',
  },
];

const ProductStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { productInfo, selectedProductTypeId } = useProductStore();

  const handleNext = () => {
    // For step 1, only proceed if a product type is selected
    if (activeStep === 0 && !selectedProductTypeId) {
      alert('Please select a product type to continue');
      return;
    }

    // For step 2, validate the form before proceeding
    if (activeStep === 1 && !isFormValid(productInfo)) {
      alert('Please fill in all required product information fields');
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <StyledPaper elevation={0}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        connector={
          <Box
            sx={{
              height: 40,
              ml: 2,
              borderLeft: '1px dashed #bdbdbd',
            }}
          />
        }
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={ColorlibStepIcon}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                // Allow going back to previous steps, but only advance to next steps when they're valid
                if (index < activeStep) {
                  setActiveStep(index);
                }
              }}
            >
              <Typography variant="subtitle1" fontWeight={500}>
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">{step.description}</Typography>
              </Box>

              {index === 0 && <ProductTypeSelector />}
              {index === 1 && <ProductInfo />}
              {index === 2 && <ProductImage />}

              <Box sx={{ mb: 2, mt: 3 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Box sx={{ p: 3, mt: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography sx={{ mt: 1, mb: 1 }}>
            All steps completed - your product is ready for review.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Create Another Product</Button>
          </Box>
        </Box>
      )}
    </StyledPaper>
  );
};

export default ProductStepper;
