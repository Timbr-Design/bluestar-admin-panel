import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";

const initialState = {
  receipts: [],
  currentSelectedInvoice: {} as any,
  filters: {
    status: undefined,
    search: undefined,
  },
  isEditingInvoice: false,
  receiptStates: { 
    status: "idle", 
    loading: false, 
    loadingById: false,
    error: "" 
  },
  pagination: {
    totalDocuments: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

export const getReceipts = createAsyncThunk(
  "receipt",
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
    const { id } = body;

    const response = await apiClient.patch(`/receipt${id}`);
    return response;
  }
);

export const addReceipt = createAsyncThunk(
  "billings/addReceipt",
  async (body: any, { dispatch }) => {
    const response = await apiClient.post("/receipt", body);

    return response;
  }
);

export const deleteReceipt = createAsyncThunk(
  "billings/deleteReceipt",
  async (params: any, { dispatch, getState }: any) => {
    const { id } = params;

    const response = await apiClient.delete(`/receipt/${id}`);

    return response;
  }
);

export const receiptSlice = createSlice({
  name: "receipt",
  initialState,
  reducers: {
    setInvoiceFilter: (state, action: PayloadAction<any | {}>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    setInvoices: (state, action: PayloadAction<any | {}>) => {
      return {
        ...state,
        invoices: action?.payload?.invoices,
      };
    },
    setIsEditingInvoice: (state, action: PayloadAction<boolean>) => {
      state.isEditingInvoice = action.payload;
    },
    setCurrentSelectedInvoice: (state, action: PayloadAction<any | {}>) => {
      state.currentSelectedInvoice = action.payload;
    },
    clearCurrentSelectedInvoice: (state) => {
      state.currentSelectedInvoice = {} as any;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all invoices
      .addCase(getReceipts.pending, (state) => {
        state.receiptStates.status = "loading";
        state.receiptStates.loading = true;
      })
      .addCase(getReceipts.fulfilled, (state, action) => {
        state.receiptStates.status = "succeeded";
        state.receiptStates.loading = false;
        state.receiptStates.error = "";
        state.receipts = action.payload?.invoices as any;
        state.pagination = action.payload?.pagination;
      })
      .addCase(getReceipts.rejected, (state) => {
        state.receiptStates.status = "failed";
        state.receiptStates.loading = false;
        state.receiptStates.error = "Error";
      })
      // Get invoice by ID
      .addCase(getReceiptById.pending, (state) => {
        state.receiptStates.status = "loading";
        state.receiptStates.loadingById = true;
        state.receiptStates.error = "";
      })
      .addCase(getReceiptById.fulfilled, (state, action) => {
        state.receiptStates.status = "succeeded";
        state.receiptStates.loadingById = false;
        state.receiptStates.error = "";
        state.currentSelectedInvoice = action.payload.data;
      })
      .addCase(getReceiptById.rejected, (state) => {
        state.receiptStates.status = "failed";
        state.receiptStates.loadingById = false;
        state.receiptStates.error = "Error";
      })
      // Create invoice
      .addCase(addReceipt.pending, (state) => {
        state.receiptStates.status = "loading";
        state.receiptStates.loading = true;
        state.receiptStates.error = "";
      })
      .addCase(addReceipt.fulfilled, (state) => {
        state.receiptStates.status = "succeeded";
        state.receiptStates.loading = false;
        state.receiptStates.error = "";
      })
      .addCase(addReceipt.rejected, (state) => {
        state.receiptStates.status = "failed";
        state.receiptStates.loading = false;
        state.receiptStates.error = "Error";
      })
      // Update invoice
      .addCase(updateReceiptById.pending, (state) => {
        state.receiptStates.status = "loading";
        state.receiptStates.loading = true;
        state.receiptStates.error = "";
      })
      .addCase(updateReceiptById.fulfilled, (state) => {
        state.receiptStates.status = "succeeded";
        state.receiptStates.loading = false;
        state.receiptStates.error = "";
      })
      .addCase(updateReceiptById.rejected, (state) => {
        state.receiptStates.status = "failed";
        state.receiptStates.loading = false;
        state.receiptStates.error = "Error";
      });
  },
});

export const { actions, reducer } = receiptSlice;
export const {
  setInvoiceFilter,
  setInvoices,
  setIsEditingInvoice,
  setCurrentSelectedInvoice,
  clearCurrentSelectedInvoice,
} = actions;

export default receiptSlice.reducer; 