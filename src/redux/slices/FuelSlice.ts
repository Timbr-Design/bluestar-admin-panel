/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { notification } from "antd";
import { getFuels } from "./vehicleTrackerSlice";
import { IFuel } from "../../interface/fuel";

interface IFuelState {
  fuels: IFuel[]
  filters: {
    status: string;
    search: string;
  };
  selectedFuel: any
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  openFuelForm: boolean
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
  openFuelForm: false
};

export const addNewFuel = createAsyncThunk(
  "vehicle-tracker/fuel",
  async (body: any, { dispatch }) => {
    const response = await apiClient.post("/vehicle-tracker/fuel", body);
    if (response.status === 201) {
      notification.success({
        message: "Success",
        description: "New customer added successfully",
      });
      console.log(response.data)
      dispatch(setOpenFuelForm(true));
      dispatch(getFuels({ page: "1", search: "", limit: 10 }));
      return response.data;
    }
  }
);


export const updateFuel = createAsyncThunk(
  "fuel",
  async (body: any, { dispatch, getState }: any) => {
    const { payload, id } = body;

    const response = await apiClient.put(`/fuel/${id}`, payload);
    if (response.status === 200) {
      notification.success({
        message: "Success",
        description: "Expense updated successfully",
      });
      dispatch(setOpenFuelForm(false));
      dispatch(getFuels({ page: "1", search: "", limit: 10 }));
      return response.data;
    }
  }
);

export const deleteFuel = createAsyncThunk(
  "fuel",
  async (body: any, { dispatch, getState }: any) => {
    const { id } = body;

    const response = await apiClient.delete(`/fuel/${id}`);

    if (response.status === 200) {
      dispatch(getFuels({ page: "1", search: "", limit: 10 }));
      return response.data;
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
    setOpenFuelForm: (state,action: PayloadAction<boolean>) => {
      state.openFuelForm = action.payload;
    },
    setSelectedFuel: (state,action: PayloadAction<IFuel | null>) => {
      state.selectedFuel = action.payload;
    },
    setPagination: (state, action: PayloadAction<{ total: number; page: number; limit: number }>) => {
      state.pagination = action.payload;
    },
  },
});

export const { actions, reducer } = fuelSlice;
export const {
  setAttendanceFilter,
  setPagination,
  setOpenFuelForm,
  setSelectedFuel
} = actions;
export default fuelSlice.reducer;
