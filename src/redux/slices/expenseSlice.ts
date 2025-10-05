/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import pb from "../../utils/configurePocketbase";
import { notification } from "antd";
import { IExpense } from "../../interface/expense";

interface IExpenseState {
  expenses: IExpense[];
  filters: {
    status: string;
    search: string;
  };
  selectedExpense: IExpense | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  openExpenseForm: boolean;
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
  openExpenseForm: false,
};

export const getExpenses = createAsyncThunk(
  "vehicleTracker/expense",
  async (params: any, { dispatch }) => {

    const filters: string[] = [];

    if (params.search) {
      filters.push(`vehicle_id.model_name ~ "${params.search}"`);
    }

    const filterString = filters.join(" && ");

    const resultList = await pb.collection("vehicle_expense").getList(1, 50, {
      expand: "vehicle_id",
      filter: filterString
    });

    if (resultList) {
      dispatch(setExpenses(resultList.items));
      return resultList.items;
    }
  }
);

export const addNewExpense = createAsyncThunk(
  "vehicle-tracker/expense",
  async (body: any, { dispatch }) => {
    const record = await pb.collection("vehicle_expense").create(body);

    // const response = await apiClient.post("/vehicle-tracker/expense", body);
    if (record) {
      notification.success({
        message: "Success",
        description: "New customer added successfully",
      });
      dispatch(setOpenExpenseForm(false));
      dispatch(getExpenses({ page: "1", search: "", limit: 10 }));
      return record;
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expense",
  async (body: any, { dispatch, getState }: any) => {
    const { payload, id } = body;

    const record = await pb.collection('vehicle_expense').update(id, payload);

    if (record) {
      notification.success({
        message: "Success",
        description: "Expense updated successfully",
      });
      dispatch(setOpenExpenseForm(false));
      dispatch(getExpenses({ page: "1", search: "", limit: 10 }));
      return record;
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expense",
  async (body: any, { dispatch, getState }: any) => {
    const { id } = body;

    const response = await pb.collection("vehicle_expense").delete(id);

    if (response) {
      dispatch(getExpenses({ page: "1", search: "", limit: 10 }));
      return response;
    }
  }
);

export const getExpenseById = createAsyncThunk(
  "vehicleTracker",
  async (params: any) => {
    const record = await pb.collection("vehicle_expense").getOne(params, {
      expand: "vehicle_id",
    });

    if (record) {
      return record;
    }
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
    setOpenExpenseForm: (state, action: PayloadAction<boolean>) => {
      state.openExpenseForm = action.payload;
    },
    setSelectedExpense: (state, action: PayloadAction<IExpense | null>) => {
      state.selectedExpense = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{ total: number; page: number; limit: number }>
    ) => {
      state.pagination = action.payload;
    },
    setExpenses: (state, action: PayloadAction<any>) => {
      state.expenses = action.payload;
    },
  },
});

export const { actions, reducer } = expenseSlice;
export const {
  setAttendanceFilter,
  setPagination,
  setOpenExpenseForm,
  setSelectedExpense,
  setExpenses,
} = actions;
export default expenseSlice.reducer;
