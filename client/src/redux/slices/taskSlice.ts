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
      .addCase(createTask.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.items = state.items.map((task) => task._id === action.payload._id ? action.payload : task);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      })
      .addCase(fetchTasks.rejected, (state) => { state.loading = false; });
  },
});

export default taskSlice.reducer;
