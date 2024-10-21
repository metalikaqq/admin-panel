/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import s from './page.module.scss';
import { IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ClearAllIcon from '@mui/icons-material/ClearAll';

// Mock data for emails (replace with actual email fetching)
const mockEmails = [
  {
    id: 1,
    sender: 'boss@company.com',
    subject: 'Project Update',
    isRead: false,
    isSpam: false,
    isImportant: true, // Important email
  },
  {
    id: 2,
    sender: 'unknown@spam.com',
    subject: 'You have won a prize!',
    isRead: false,
    isSpam: true, // Marked as spam
    isImportant: false,
  },
  {
    id: 3,
    sender: 'colleague@work.com',
    subject: 'Meeting Notes',
    isRead: true,
    isSpam: false,
    isImportant: false,
  },
  // More mock emails...
];

export default function NotificationPage() {
  const [emails, setEmails] = useState(mockEmails);
  const [notifications, setNotifications] = useState([] as any[]);

  // Fetch notifications based on unread emails or important flags
  useEffect(() => {
    const newNotifications = emails
      .filter((email) => !email.isRead || email.isImportant || email.isSpam)
      .map((email) => {
        let type = 'New Email';
        if (email.isImportant) type = 'Important Email';
        if (email.isSpam) type = 'Spam Alert';
        return {
          id: email.id,
          subject: email.subject,
          sender: email.sender,
          type,
        };
      });
    setNotifications(newNotifications);
  }, [emails]);

  // Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Simulate receiving a new email (admin can trigger this to test notifications)
  const simulateNewEmail = () => {
    const newEmail = {
      id: emails.length + 1,
      sender: 'new.sender@company.com',
      subject: 'New Project Information',
      isRead: false,
      isSpam: false,
      isImportant: false,
    };
    setEmails([...emails, newEmail]);
  };

  // Render notifications
  const renderNotifications = () => {
    return notifications.map((notification) => (
      <div key={notification.id} className={s.notification__item}>
        <p>
          <strong>{notification.type}:</strong> {notification.subject} from{' '}
          {notification.sender}
        </p>
      </div>
    ));
  };

  return (
    <div className={s.main}>
      <h1 className={s.title}>Notifications</h1>
      <div className={s.notifications__header}>
        <IconButton onClick={clearNotifications}>
          <ClearAllIcon /> Clear All
        </IconButton>
        <IconButton onClick={simulateNewEmail}>
          <NotificationsIcon /> Simulate New Email
        </IconButton>
      </div>
      <div className={s.notifications__list}>
        {notifications.length > 0 ? (
          renderNotifications()
        ) : (
          <p>No new notifications</p>
        )}
      </div>
    </div>
  );
}
