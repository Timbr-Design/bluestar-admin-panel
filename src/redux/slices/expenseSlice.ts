/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { notification } from "antd";
import { getExpenses } from "./vehicleTrackerSlice";
import { IExpense } from "../../interface/expense";

interface IExpenseState {
  expenses: IExpense[]
  filters: {
    status: string;
    search: string;
  };
  selectedExpense: IExpense | null
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  openExpenseForm: boolean
}

const initialState: IExpenseState = {
  expenses: [],
  selectedExpense: null,
  filters: {
    status: "",
    search: "",
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  openExpenseForm: false
};

export const addNewExpense = createAsyncThunk(
  "vehicle-tracker/expense",
  async (body: any, { dispatch }) => {
    const response = await apiClient.post("/vehicle-tracker/expense", body);
    if (response.status === 201) {
      notification.success({
        message: "Success",
        description: "New customer added successfully",
      });
      console.log(response.data)
      dispatch(setOpenExpenseForm(false));
      dispatch(getExpenses({ page: "1", search: "", limit: 10 }));
      return response.data;
    }
  }
);


export const updateExpense = createAsyncThunk(
  "expense",
  async (body: any, { dispatch, getState }: any) => {
    const { payload, id } = body;

    const response = await apiClient.put(`/expense/${id}`, payload);
    if (response.status === 200) {
      notification.success({
        message: "Success",
        description: "Expense updated successfully",
      });
      dispatch(setOpenExpenseForm(false));
      dispatch(getExpenses({ page: "1", search: "", limit: 10 }));
      return response.data;
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expense",
  async (body: any, { dispatch, getState }: any) => {
    const { id } = body;

    const response = await apiClient.delete(`/expense/${id}`);

    if (response.status === 200) {
      dispatch(getExpenses({ page: "1", search: "", limit: 10 }));
      return response.data;
    }
  }
);

export const getExpenseById = createAsyncThunk(
  "vehicleTracker",async (params: any) => {
    const response = await apiClient.get("/vehicle-tracker/expense",{params});
    return response.data.data;
  }
  // async (params: any) => {

    
  //   // const response = await apiClient.get("/auth/admin/login", { params });
  //   // return response.data;

  //   return {
  //     total: 10,
  //     page: 1,
  //     limit: 10,
  //     data: getExpenseData, // replace with rea; later
  //   };
  // }
);


export const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setAttendanceFilter: (state, action: PayloadAction<any | {}>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setOpenExpenseForm: (state,action: PayloadAction<boolean>) => {
      state.openExpenseForm = action.payload;
    },
    setSelectedExpense: (state,action: PayloadAction<IExpense | null>) => {
      state.selectedExpense = action.payload;
    },
    setPagination: (state, action: PayloadAction<{ total: number; page: number; limit: number }>) => {
      state.pagination = action.payload;
    },
  },
});

export const { actions, reducer } = expenseSlice;
export const {
  setAttendanceFilter,
  setPagination,
  setOpenExpenseForm,
  setSelectedExpense
} = actions;
export default expenseSlice.reducer;
