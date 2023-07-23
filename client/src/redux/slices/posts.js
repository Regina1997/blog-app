import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const fetchPostByTag = createAsyncThunk('posts/fetchPostByTag', async (name) => {
  const { data } = await axios.get(`/tag/${name}`);
  return data;
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) =>
  axios.delete(`/posts/${id}`),
);

export const fetchAddComments = createAsyncThunk('posts/fetchAddComments', async ({ id, text }) => {
  try {
    const response = await axios.patch(`/comment/${id}`, {
      comment: text,
    });
    return response.data; // Assuming the API returns the updated comment data
  } catch (error) {
    throw new Error('Failed to add comment'); // You can handle errors as needed
  }
});

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
  filtered: {
    items: [],
    status: 'loading',
  },
  data : {
    items: [],
    status: 'loading',
  }
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data.items = action.payload; 
      state.data.status = 'loaded'
    },
  },
  extraReducers(builder) {
    builder
    .addCase(fetchPosts.pending, (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    })
    .addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    })
    .addCase(fetchPosts.rejected, (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    })
    .addCase(fetchTags.pending, (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    })
    .addCase(fetchTags.fulfilled, (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    })
    .addCase(fetchTags.rejected, (state, action) => {
      state.tags.items = [];
      state.tags.status = 'error';
    })
    .addCase(fetchPostByTag.pending, (state) => {
      state.filtered.items = [];
      state.filtered.status = 'loading';
    })
    .addCase(fetchPostByTag.fulfilled, (state, action) => {
      state.filtered.items = action.payload;
      state.filtered.status = 'loaded';
    })
    .addCase(fetchPostByTag.rejected, (state) => {
      state.filtered.items = [];
      state.filtered.status = 'error';
    })
    .addCase(fetchAddComments.pending, (state) => {
      state.data.items = [];
      state.filtered.status = 'loading';
      state.data.status = 'loading'
    })
    .addCase(fetchAddComments.fulfilled, (state, action) => {
      state.data.items = action.payload.comments;
      state.filtered.status = 'loaded';
      state.data.status = 'loaded';
    })
    .addCase(fetchAddComments.rejected, (state) => {
      state.data.items = [];
      state.filtered.status = 'error';
    })
  },
});

export const { setData } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;