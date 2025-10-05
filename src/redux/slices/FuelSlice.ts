/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { notification } from "antd";
import { IFuel } from "../../interface/fuel";
import pb from "../../utils/configurePocketbase";

interface IFuelState {
  fuels: IFuel[];
  filters: {
    status: string;
    search: string;
  };
  selectedFuel: IFuel;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  openFuelForm: boolean;
}

const initialState: IFuelState = {
  fuels: [],
  selectedFuel: null,
  filters: {
    status: "",
    search: "",
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  openFuelForm: false,
};

export const getFuels = createAsyncThunk(
  "vehicleTracker/expense",
  async (params: any, { dispatch }) => {

    const filters: string[] = [];

    if (params.search) {
      filters.push(`vehicle_id.model_name ~ "${params.search}"`);
    }

    const filterString = filters.join(" && ");

    const resultList = await pb
      .collection("vehicle_fuel_expense")
      .getList(1, 50,{
        expand: "driver_id,vehicle_id",
        filter: filterString,
      });

    if (resultList) {
      dispatch(setFuels(resultList.items));
      return resultList.items;
    }
  }
);

export const addNewFuel = createAsyncThunk(
  "vehicle-tracker/fuel",
  async (body: any, { dispatch }) => {
    const record = await pb.collection("vehicle_fuel_expense").create(body);

    if (record) {
      notification.success({
        message: "Success",
        description: "New customer added successfully",
      });
      dispatch(setOpenFuelForm(false));
      dispatch(getFuels({ page: "1", search: "", limit: 10 }));
      return record;
    }
  }
);

export const updateFuel = createAsyncThunk(
  "fuel",
  async (body: any, { dispatch, getState }: any) => {
    const { payload, id } = body;

    const record = await pb
      .collection("vehicle_fuel_expense")
      .update(id, payload);

    if (record) {
      notification.success({
        message: "Success",
        description: "Expense updated successfully",
      });
      dispatch(setOpenFuelForm(false));
      dispatch(getFuels({ page: "1", search: "", limit: 10 }));
      return record;
    }
  }
);

export const deleteFuel = createAsyncThunk(
  "fuel",
  async (body: any, { dispatch, getState }: any) => {
    const { id } = body;

    const response = await pb.collection('vehicle_fuel_expense').delete(id);


    if (response) {
      dispatch(getFuels({ page: "1", search: "", limit: 10 }));
      return response;
    }
  }
);

export const fuelSlice = createSlice({
  name: "fuels",
  initialState,
  reducers: {
    setAttendanceFilter: (state, action: PayloadAction<any | {}>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setOpenFuelForm: (state, action: PayloadAction<boolean>) => {
      state.openFuelForm = action.payload;
    },
    setSelectedFuel: (state, action: PayloadAction<IFuel | null>) => {
      state.selectedFuel = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{ total: number; page: number; limit: number }>
    ) => {
      state.pagination = action.payload;
    },
    setFuels: (state, action: PayloadAction<any>) => {
      state.fuels = action.payload;
    },
  },
});

export const { actions, reducer } = fuelSlice;
export const {
  setAttendanceFilter,
  setPagination,
  setOpenFuelForm,
  setSelectedFuel,
  setFuels,
} = actions;
export default fuelSlice.reducer;
