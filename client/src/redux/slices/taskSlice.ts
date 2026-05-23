import { createSlice } from '@reduxjs/toolkit';
import type { Task } from '../../types/task.types';
import { createTask, deleteTask, fetchTasks, updateTask } from '../thunks/taskThunk';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { items: [] as Task[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.items = action.payload; state.loading = false; })
      .addCase(createTask.pending, (state) => { state.loading = true; })
      .addCase(createTask.fulfilled, (state, action) => { state.items.unshift(action.payload); state.loading = false; })
      .addCase(createTask.rejected, (state) => { state.loading = false; })
      .addCase(updateTask.pending, (state) => { state.loading = true; })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.items = state.items.map((task) => task._id === action.payload._id ? action.payload : task);
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state) => { state.loading = false; })
      .addCase(deleteTask.pending, (state) => { state.loading = true; })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state) => { state.loading = false; })
      .addCase(fetchTasks.rejected, (state) => { state.loading = false; });
  },
});

export default taskSlice.reducer;
