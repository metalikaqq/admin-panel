'use client';

import React, { useState } from 'react';
import s from './page.module.scss';
import { IconButton } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const mockEmails = [
  {
    id: 1,
    sender: 'scam@phishy.com',
    subject: "You've won a prize!",
    content: 'Click here to claim your prize...',
    fullContent:
      "Congratulations! You've won a prize. Please click the link to claim your reward.",
    isRead: false,
    isFavorite: false,
    isTrash: false,
    isSpam: true, // Mocked email in spam
  },
  {
    id: 2,
    sender: 'spammer@junkmail.com',
    subject: 'Limited Time Offer!',
    content: "Don't miss out on this incredible offer...",
    fullContent:
      "Act fast! This limited-time offer won't last long. Click the link to find out more about this amazing opportunity.",
    isRead: false,
    isFavorite: false,
    isTrash: false,
    isSpam: true, // Another spam email
  },
  // More mock emails...
];

export default function SpamPage() {
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);

  // Restore email from spam
  const restoreEmail = (id: number) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, isSpam: false } : email
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
    if (!email)
      return <p>Select an email from the spam folder to view details.</p>;

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

  // Render spam email previews to select from
  const renderSpamEmailList = () => {
    return emails
      .filter((email) => email.isSpam)
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
      <h1 className={s.title}>Spam</h1>
      <div className={s.email__container}>
        <div className={s.email__list}>
          {renderSpamEmailList().length > 0 ? (
            renderSpamEmailList()
          ) : (
            <p>No emails in the spam folder</p>
          )}
        </div>
        <div className={s.email__details}>{renderSelectedEmail()}</div>
      </div>
    </div>
  );
}
