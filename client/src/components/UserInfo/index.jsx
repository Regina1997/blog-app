import React from "react";
import styles from "./UserInfo.module.scss";
import { Avatar } from "@mui/material";

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src={avatarUrl}
        alt={fullName}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
