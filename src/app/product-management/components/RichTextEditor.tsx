'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { CircularProgress, Box } from '@mui/material';
import type { EditorProps } from 'react-draft-wysiwyg';

// Dynamically import the editor to avoid SSR issues
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <CircularProgress size={24} />
      </Box>
    ),
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  maxLength?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter content...',
  error = false,
  disabled = false,
  maxLength,
}: RichTextEditorProps) {
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize editor state from HTML value only once
  useEffect(() => {
    if (isClient && !isInitialized) {
      if (value && value.trim() !== '') {
        try {
          const contentState = stateFromHTML(value);
          setEditorState(EditorState.createWithContent(contentState));
        } catch (error) {
          console.warn('Failed to parse HTML content:', error);
          setEditorState(EditorState.createEmpty());
        }
      } else {
        setEditorState(EditorState.createEmpty());
      }
      setIsInitialized(true);
    }
  }, [value, isClient, isInitialized]);

  const handleEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    // Convert editor content to HTML
    const contentState = newEditorState.getCurrentContent();
    const html = stateToHTML(contentState);

    // Check if content exceeds max length
    if (maxLength) {
      const plainText = contentState.getPlainText();
      if (plainText.length > maxLength) {
        return; // Don't update if exceeds max length
      }
    }

    // Only call onChange if content actually changed to prevent cursor jumping
    const currentHtml = stateToHTML(editorState.getCurrentContent());
    if (html !== currentHtml) {
      onChange(html);
    }
  };

  // Don't render anything on server side
  if (!isClient) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  const editorProps: EditorProps = {
    editorState,
    onEditorStateChange: handleEditorStateChange,
    placeholder,
    readOnly: disabled,
    toolbar: {
      options: ['inline', 'blockType', 'list', 'link', 'history'],
      inline: {
        options: ['bold', 'italic', 'underline'],
      },
      blockType: {
        inDropdown: true,
        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
      },
      list: {
        inDropdown: false,
        options: ['unordered', 'ordered', 'indent', 'outdent'],
      },
      link: {
        inDropdown: false,
        showOpenOptionOnHover: true,
        defaultTargetOption: '_blank',
        options: ['link', 'unlink'],
      },
      history: {
        inDropdown: false,
        options: ['undo', 'redo'],
      },
    },
    toolbarStyle: {
      border: error ? '1px solid #f44336' : '1px solid #ccc',
      borderBottom: 'none',
      borderRadius: '4px 4px 0 0',
    },
    editorStyle: {
      border: error ? '1px solid #f44336' : '1px solid #ccc',
      borderTop: 'none',
      borderRadius: '0 0 4px 4px',
      minHeight: '150px',
      padding: '12px',
      backgroundColor: disabled ? '#f5f5f5' : '#fff',
    },
    wrapperStyle: {
      marginBottom: '8px',
    },
  };

  return (
    <div>
      <Editor {...editorProps} />
      {maxLength && (
        <Box
          mt={1}
          textAlign="right"
          fontSize="0.875rem"
          color="text.secondary"
        >
          {editorState.getCurrentContent().getPlainText().length}/{maxLength}{' '}
          characters
        </Box>
      )}
    </div>
  );
}
