/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import pb from "../../utils/configurePocketbase";
import { IAverage } from "../../interface/average";

interface ILoanState {
  average: IAverage[];
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
  average: [],
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

export const getAverage = createAsyncThunk(
  "vehicleTracker/average",
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
      dispatch(setAverage(resultList.items));
      return resultList.items;
    }
  }
);

export const averageSlice = createSlice({
  name: "average",
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
    setAverage: (state, action: PayloadAction<any>) => {
      state.average = action.payload;
    },
  },
});

export const { actions, reducer } = averageSlice;
export const {
  setAttendanceFilter,
  setPagination,
  setAverage,
} = actions;
export default averageSlice.reducer;
