import React, { useCallback, useMemo, useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddComments } from "../../redux/slices/posts";

export const Index = () => {
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const userData = useSelector((state) => state.auth.data);
  const { id } = useParams();
  const dispatch = useDispatch();

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    if (text !== "") {
      try {
        dispatch(fetchAddComments({ id: id, text: text }));
        setText("");

      } catch (err) {
        console.warn(err);
        alert("Ошибка при добавлении комментария!");
      }
    }
  };

  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src={userData?.avatarUrl}
      />
      <div className={styles.form}>
        <TextField
          value={text}
          onChange={(e) => onChange(e.target.value)}
          options={options}
          label="Написать комментарий"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
        />
        <Button disabled={isLoading} onClick={onSubmit} variant="contained">
          Отправить
        </Button>
      </div>
    </div>
  );
};
