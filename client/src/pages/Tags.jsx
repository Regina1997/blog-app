import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPostByTag, fetchTags } from "../redux/slices/posts";
import { Grid } from "@mui/material";
import { CommentsBlock, Post, TagsBlock } from "../components";   

export const Tags = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  
  const { filtered, tags } = useSelector((state) => state.posts);

  const isPostsLoading = filtered.status === "loading";
  const isTagsLoading = tags.status === "loading";

  useEffect(() => {
    dispatch(fetchPostByTag(name));
    dispatch(fetchTags());
  }, [name]);

  return (
    <>
      <h2>{`#${name}`}</h2>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : filtered.items).map((obj, index) =>
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
            items={filtered.items.filter(item => item.comments.length > 0).map(item => [...item.comments]).flat()}
            isLoading={isPostsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
