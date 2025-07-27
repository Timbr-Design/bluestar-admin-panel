/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { notification } from "antd";

export const getInvoices = createAsyncThunk(
  "billings/getInvoices",
  async (params: any, { dispatch }) => {
    const response = await apiClient.get(`/invoice`, {
      params,
    });

    return response.data;
  }
);

export const getInvoiceById = createAsyncThunk(
  "billings/getInvoiceById",
  async (params: any, { dispatch }) => {
    const { id } = params;
    const response = await apiClient.get(`/invoice/${id}`);

    return response.data;
  }
);

export const updateInvoiceById = createAsyncThunk(
  "billings/updateInvoiceById",
  async (body: any, { dispatch, getState }: any) => {
    const { id, payload } = body;

    const response = await apiClient.patch(`/invoice${id}`);
  }
);

export const addInvoice = createAsyncThunk(
  "billings/addInvoice",
  async (body: any, { dispatch }) => {
    const response = await apiClient.post("/invoice", body);
    console.log(response.data)
    dispatch(setInvoices(response.data))
    return {}
  }
);

export const deleteInvoice = createAsyncThunk(
  "billings/deleteInvoice",
  async (params: any, { dispatch, getState }: any) => {
    const { id } = params;

    const response = await apiClient.delete(`/invoice/${id}`);
  }
);

//
export const getReceipts = createAsyncThunk(
  "billings/getReceipts",
  async (params: any, { dispatch }) => {
    const response = await apiClient.get(`/receipt`, {
      params,
    });

    return response.data;
  }
);

export const getReceiptById = createAsyncThunk(
  "billings/getReceiptById",
  async (params: any, { dispatch }) => {
    const { id } = params;
    const response = await apiClient.get(`/receipt/${id}`);

    return response.data;
  }
);

export const updateReceiptById = createAsyncThunk(
  "billings/updateReceiptById",
  async (body: any, { dispatch, getState }: any) => {
    const { id, payload } = body;

    const response = await apiClient.patch(`/receipt${id}`);
  }
);

export const addReceipt = createAsyncThunk(
  "billings/addReceipt",
  async (body: any, { dispatch }) => {
    const response = await apiClient.post("/receipt", body);
  }
);

export const deleteReceipt = createAsyncThunk(
  "billings/deleteReceipt",
  async (params: any, { dispatch, getState }: any) => {
    const { id } = params;

    const response = await apiClient.delete(`/receipt/${id}`);
  }
);

const initialState = {
  invoices: [],
  receipts: [],
  pagination: {
    total: 0,
    page: 0,
    limit: 10,
  },
  filters: {
    status: undefined,
    search: undefined,
  },
  billingStates: { status: "idle", loading: false, error: "" },
};

export const billingSlice = createSlice({
  name: "billings",
  initialState,
  reducers: {
    setInvoices: (state, action: PayloadAction<any | {}>) => {
      return {
        ...state,
        invoices: action?.payload?.invoices,
      };
    },
    setBillingFilter: (state, action: PayloadAction<any | {}>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setReceipts: (state, action: PayloadAction<any | {}>) => {
      return {
        ...state,
        receipts: action?.payload?.receipts,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // get getInvoices
      .addCase(getInvoices.pending, (state) => {
        state.billingStates.status = "loading";
        state.billingStates.loading = true;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.billingStates.status = "succeeded";
        state.billingStates.loading = false;
        state.billingStates.error = "";
        state.invoices = action.payload?.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getInvoices.rejected, (state) => {
        state.billingStates.status = "failed";
        state.billingStates.loading = false;
        state.billingStates.error = "Error";
      })
      // get getReceipts
      .addCase(getReceipts.pending, (state) => {
        state.billingStates.status = "loading";
        state.billingStates.loading = true;
      })
      .addCase(getReceipts.fulfilled, (state, action) => {
        state.billingStates.status = "succeeded";
        state.billingStates.loading = false;
        state.billingStates.error = "";
        state.invoices = action.payload?.data as any;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(getReceipts.rejected, (state) => {
        state.billingStates.status = "failed";
        state.billingStates.loading = false;
        state.billingStates.error = "Error";
      });
  },
});
export const { actions, reducer } = billingSlice;
export const { setInvoices, setBillingFilter } = actions;
export default billingSlice.reducer;
