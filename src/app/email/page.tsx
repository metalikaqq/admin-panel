"use client";

import React, { useState, useEffect } from "react";
import s from "./page.module.scss";
import { IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";

// Mock data for emails (replace with actual email fetching)
const mockEmails = [
  {
    id: 1,
    sender: "boss@company.com",
    subject: "Project Update",
    content: "Please find attached the latest update on the project...",
    fullContent:
      "Please find attached the latest update on the project. Make sure to review it and let me know if any changes are required by tomorrow.",
    isRead: false,
    isFavorite: false,
    isTrash: false,
    isSpam: false,
  },
  {
    id: 2,
    sender: "hr@company.com",
    subject: "Meeting Invitation",
    content: "You are invited to the quarterly meeting...",
    fullContent:
      "You are invited to the quarterly meeting happening on Friday, 10:00 AM. Please make sure to join via the provided link in the invitation.",
    isRead: false,
    isFavorite: false,
    isTrash: false,
    isSpam: false,
  },
  // More mock emails...
];

export default function EmailPage() {
  const [emails, setEmails] = useState(mockEmails); // Replace with fetched emails
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);

  // Simulate email fetching (replace with API call)
  useEffect(() => {
    // fetchEmails() would be called here to populate the email list
    setEmails(mockEmails);
  }, []);

  // Handle clicking an email to view full details
  const handleEmailClick = (id: number) => {
    setSelectedEmail(id);
    markEmailAsRead(id); // Mark email as read when clicked
  };

  // Toggle read/unread status
  const toggleReadStatus = (id: number) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, isRead: !email.isRead } : email
      )
    );
  };

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, isFavorite: !email.isFavorite } : email
      )
    );
  };

  // Move email to Trash
  const moveToTrash = (id: number) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, isTrash: true } : email
      )
    );
  };

  // Mark email as Spam
  const markAsSpam = (id: number) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, isSpam: true } : email
      )
    );
  };

  // Mark email as read when clicked
  const markEmailAsRead = (id: number) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, isRead: true } : email
      )
    );
  };

  // Render email previews
  const renderEmailPreview = () => {
    return emails
      .filter((email) => !email.isTrash && !email.isSpam) // Exclude trash/spam emails
      .map((email) => (
        <div
          key={email.id}
          className={`${s.email__item} ${email.isRead ? s.read : s.unread}`}
          onClick={() => handleEmailClick(email.id)}
        >
          <div className={s.email__controls}>
            <IconButton onClick={() => toggleFavorite(email.id)}>
              {email.isFavorite ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
            <IconButton onClick={() => toggleReadStatus(email.id)}>
              {email.isRead ? <MarkEmailUnreadIcon /> : <MarkEmailReadIcon />}
            </IconButton>
            <IconButton onClick={() => moveToTrash(email.id)}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => markAsSpam(email.id)}>
              <ReportIcon />
            </IconButton>
          </div>
          <h4 className={s.email__subject}>{email.subject}</h4>
          <p className={s.email__sender}>{email.sender}</p>
          <p className={s.email__content}>{email.content}</p>
        </div>
      ));
  };

  // Render full email content
  const renderFullEmail = () => {
    const email = emails.find((e) => e.id === selectedEmail);
    if (!email) return null;

    return (
      <div className={s.email__full}>
        <h2 className={s.email__subject}>{email.subject}</h2>
        <p className={s.email__sender}>From: {email.sender}</p>
        <div className={s.email__body}>{email.fullContent}</div>
      </div>
    );
  };

  return (
    <div className={s.main}>
      <h1 className={s.title}>Work Emails</h1>
      <div className={s.email__container}>
        <div className={s.email__list}>{renderEmailPreview()}</div>
        <div className={s.email__details}>
          {selectedEmail ? (
            renderFullEmail()
          ) : (
            <p>Select an email to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
