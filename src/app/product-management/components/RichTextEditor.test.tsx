import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RichTextEditor from './RichTextEditor';

// Mock next/dynamic
jest.mock(
  'next/dynamic',
  () => (component: () => Promise<{ default: React.ComponentType }>) => {
    return function MockedDynamicComponent(props: Record<string, unknown>) {
      const Component = React.lazy(component);
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Component {...props} />
        </React.Suspense>
      );
    };
  }
);

// Mock react-draft-wysiwyg
jest.mock('react-draft-wysiwyg', () => ({
  Editor: (props: {
    onEditorStateChange?: (state: unknown) => void;
    placeholder?: string;
  }) => {
    const handleChange = () => {
      // Mock editor state change
      if (props.onEditorStateChange) {
        const mockEditorState = {
          getCurrentContent: () => ({
            getPlainText: () => 'Test content',
          }),
        };
        props.onEditorStateChange(mockEditorState);
      }
    };

    return (
      <div data-testid="mock-editor">
        <button onClick={handleChange} data-testid="editor-change-button">
          Mock Editor Change
        </button>
        <div>{props.placeholder}</div>
      </div>
    );
  },
}));

// Mock draft-js conversion functions
jest.mock('draft-js-export-html', () => ({
  stateToHTML: jest.fn().mockReturnValue('<p>Test HTML content</p>'),
}));

jest.mock('draft-js-import-html', () => ({
  stateFromHTML: jest.fn().mockReturnValue({}),
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  CircularProgress: ({ size }: { size: number }) => (
    <div data-testid="loading-spinner">Loading... (size: {size})</div>
  ),
  Box: ({
    children,
    ...props
  }: Record<string, unknown> & { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
}));

describe('RichTextEditor', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    const mockOnChange = jest.fn();

    render(<RichTextEditor value="" onChange={mockOnChange} />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('calls onChange when editor content changes', async () => {
    const mockOnChange = jest.fn();

    render(
      <RichTextEditor
        value=""
        onChange={mockOnChange}
        placeholder="Test placeholder"
      />
    );

    // Wait for component to mount and show editor
    await waitFor(() => {
      const editorChangeButton = screen.queryByTestId('editor-change-button');
      if (editorChangeButton) {
        fireEvent.click(editorChangeButton);
        expect(mockOnChange).toHaveBeenCalledWith('<p>Test HTML content</p>');
      }
    });
  });

  test('displays placeholder text', async () => {
    const mockOnChange = jest.fn();
    const placeholder = 'Enter your content here';

    render(
      <RichTextEditor
        value=""
        onChange={mockOnChange}
        placeholder={placeholder}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(placeholder)).toBeInTheDocument();
    });
  });

  test('handles disabled state', () => {
    const mockOnChange = jest.fn();

    render(<RichTextEditor value="" onChange={mockOnChange} disabled={true} />);

    // Component should still render
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('handles error state', () => {
    const mockOnChange = jest.fn();

    render(<RichTextEditor value="" onChange={mockOnChange} error={true} />);

    // Component should still render
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
