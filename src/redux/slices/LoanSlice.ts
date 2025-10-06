/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import pb from "../../utils/configurePocketbase";
import { ILoans } from "../../interface/loans";

interface ILoanState {
  loans: ILoans[];
  filters: {
    status: string;
    search: string;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

const initialState: ILoanState = {
  loans: [],
  filters: {
    status: "",
    search: "",
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

export const getLoans = createAsyncThunk(
  "vehicleTracker/loans",
  async (params: any, { dispatch }) => {

    const filters: string[] = [];

    if (params.search) {
      filters.push(`vehicle_id.model_name ~ "${params.search}"`);
    }

    const filterString = filters.join(" && ");

    const resultList = await pb
      .collection("vehicle_loan")
      .getList(1, 50,{
        expand: "driver_id,vehicle_id",
        filter: filterString,
      });

    if (resultList) {
      dispatch(setLoans(resultList.items));
      return resultList.items;
    }
  }
);

export const loanSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    setAttendanceFilter: (state, action: PayloadAction<any | {}>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setPagination: (
      state,
      action: PayloadAction<{ total: number; page: number; limit: number }>
    ) => {
      state.pagination = action.payload;
    },
    setLoans: (state, action: PayloadAction<any>) => {
      state.loans = action.payload;
    },
  },
});

export const { actions, reducer } = loanSlice;
export const {
  setAttendanceFilter,
  setPagination,
  setLoans,
} = actions;
export default loanSlice.reducer;
