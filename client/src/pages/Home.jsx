import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { useDispatch, useSelector } from "react-redux";

export const Home = () => {
  const [isPopular, setPopular] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const [data, setData] = useState([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const checkSort = () => {
    if (isPopular) {
      setData([...posts.items].sort((a, b) => b.viewsCount - a.viewsCount));
    } else {
      setData(
        [...posts.items].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    }
  };

  const filterHandler = (value, obj) => {
    if (isPopular !== value) {
      setPopular(value);
    }
  };
  useEffect(() => {
    checkSort();
  }, [isPopular]);

  useEffect(() => {
    if (posts.items.length > 0) {
      checkSort();
    }
  }, [posts.items]);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab value={0} label="Новые" onClick={() => filterHandler(false)} />
        <Tab value={1} label="Популярные" onClick={() => filterHandler(true)} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : data).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={data.filter(item => item.comments.length > 0).map(item => [...item.comments]).flat()}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
