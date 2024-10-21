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
    isTrash: true,
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
    isTrash: true,
    isSpam: false,
  },
  // More mock emails...
];

export default function SelectedTrashPage() {
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);

  // Restore email from trash
  const restoreEmail = (id: number) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, isTrash: false } : email
      )
    );
    setSelectedEmail(null); // Close the email after restoring
  };

  // Permanently delete an email
  const deleteEmailForever = (id: number) => {
    setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
    setSelectedEmail(null); // Close the email after deletion
  };

  // Render the selected email content
  const renderSelectedEmail = () => {
    const email = emails.find((e) => e.id === selectedEmail);
    if (!email) return <p>Select an email from the trash to view details.</p>;

    return (
      <div className={s.email__full}>
        <h2 className={s.email__subject}>{email.subject}</h2>
        <p className={s.email__sender}>From: {email.sender}</p>
        <div className={s.email__body}>{email.fullContent}</div>
        <div className={s.email__actions}>
          <IconButton onClick={() => restoreEmail(email.id)}>
            <RestoreIcon />
          </IconButton>
          <IconButton onClick={() => deleteEmailForever(email.id)}>
            <DeleteForeverIcon />
          </IconButton>
        </div>
      </div>
    );
  };

  // Render trash email previews to select from
  const renderTrashEmailList = () => {
    return emails
      .filter((email) => email.isTrash)
      .map((email) => (
        <div
          key={email.id}
          className={s.email__item}
          onClick={() => setSelectedEmail(email.id)}
        >
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
        <div className={s.email__list}>
          {renderTrashEmailList().length > 0 ? (
            renderTrashEmailList()
          ) : (
            <p>No emails in the trash</p>
          )}
        </div>
        <div className={s.email__details}>{renderSelectedEmail()}</div>
      </div>
    </div>
  );
}
