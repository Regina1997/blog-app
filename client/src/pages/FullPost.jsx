import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../redux/slices/posts";

export const FullPost = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.posts);

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        dispatch(setData(res.data.comments));
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении статьи");
      });
  }, []);

  useEffect(() => {}, [data]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={items._id}
        title={items.title}
        imageUrl={
          items.imageUrl
            ? `http://localhost:4444${items.imageUrl}`
            : ""
        }
        user={items.user}
        createdAt={items.createdAt}
        viewsCount={items.viewsCount}
        commentsCount={data.items.length > 0 ? data.items.length : items.comments.length}
        tags={items.tags}
        isFullPost
      >
        <ReactMarkdown children={items.text} />
      </Post>
      <CommentsBlock isLoading={data.status === 'loading'} items={data.items}>
        <Index />
      </CommentsBlock>
    </>
  );
};
