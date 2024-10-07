// pages/account.tsx
"use client";

import React, { useState, useEffect } from "react";
import s from "./page.module.scss";

type UserRole = "admin" | "user";

interface User {
  username: string;
  role: UserRole;
}

const mockCurrentUser: User = {
  username: "john_doe",
  role: "admin", // Mock role, can be 'user' or 'admin'
};

export default function AccountPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  // const [newRole, setNewRole] = useState<UserRole>("user");
  const [allUsers, setAllUsers] = useState<User[]>([
    { username: "jane_smith", role: "user" },
    { username: "mark_admin", role: "admin" },
  ]); // Mock user list

  useEffect(() => {
    // Simulating fetching user data from the server
    setCurrentUser(mockCurrentUser);
  }, []);

  const handlePasswordChangeRequest = () => {
    if (!email) {
      alert("Please enter your email address!");
      return;
    }

    alert(`A confirmation email has been sent to ${email}. Please check your inbox to confirm the password change.`);
    // Implement logic to send confirmation email with a password reset link
  };

  const handleRoleChange = (username: string, role: UserRole) => {
    setAllUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.username === username ? { ...user, role: role } : user
      )
    );
    alert(`Role updated successfully for ${username}`);
    // Implement role update logic here
  };

  return (
    <div className={s.account__page}>
      <h1 className={s.account__title}>Account Settings</h1>

      {currentUser && (
        <>
          <div className={s.account__section}>
            <h3>Request Password Change</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={s.account__input}
            />
            <button onClick={handlePasswordChangeRequest} className={s.account__button}>
              Request Password Change
            </button>
          </div>

          <div className={s.account__section}>
            <h3>Current Role: {currentUser.role}</h3>
          </div>

          {currentUser.role === "admin" && (
            <div className={s.account__section}>
              <h3>Manage User Roles</h3>
              <table className={s.account__table}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.username}>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.username, e.target.value as UserRole)
                          }
                          className={s.account__select}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
