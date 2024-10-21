'use client';

import React, { useState } from 'react';
import s from './page.module.scss';
import { IconButton } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const mockEmails = [
  {
    id: 1,
    sender: 'boss@company.com',
    subject: 'Project Update',
    content: 'Please find attached the latest update on the project...',
    fullContent:
      'Please find attached the latest update on the project. Make sure to review it and let me know if any changes are required by tomorrow.',
    isRead: false,
    isFavorite: false,
    isTrash: true, // Mocked email in trash
    isSpam: false,
  },
  {
    id: 2,
    sender: 'hr@company.com',
    subject: 'Meeting Invitation',
    content: 'You are invited to the quarterly meeting...',
    fullContent:
      'You are invited to the quarterly meeting happening on Friday, 10:00 AM. Please make sure to join via the provided link in the invitation.',
    isRead: false,
    isFavorite: false,
    isTrash: false, // This one is not in trash
    isSpam: false,
  },
  // More mock emails...
];

export default function TrashPage() {
  const [emails, setEmails] = useState(mockEmails);

  // Handle restoring an email from trash
  const restoreEmail = (id: number) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, isTrash: false } : email
      )
    );
  };

  // Permanently delete an email
  const deleteEmailForever = (id: number) => {
    setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
  };

  // Render trashed emails
  const renderTrashEmails = () => {
    return emails
      .filter((email) => email.isTrash) // Only show trashed emails
      .map((email) => (
        <div key={email.id} className={s.email__item}>
          <div className={s.email__controls}>
            <IconButton onClick={() => restoreEmail(email.id)}>
              <RestoreIcon />
            </IconButton>
            <IconButton onClick={() => deleteEmailForever(email.id)}>
              <DeleteForeverIcon />
            </IconButton>
          </div>
          <h4 className={s.email__subject}>{email.subject}</h4>
          <p className={s.email__sender}>{email.sender}</p>
          <p className={s.email__content}>{email.content}</p>
        </div>
      ));
  };

  return (
    <div className={s.main}>
      <h1 className={s.title}>Trash</h1>
      <div className={s.email__container}>
        {renderTrashEmails().length > 0 ? (
          renderTrashEmails()
        ) : (
          <p>No emails in the trash</p>
        )}
      </div>
    </div>
  );
}
