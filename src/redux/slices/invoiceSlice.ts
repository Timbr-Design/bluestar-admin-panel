import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { notification } from "antd";

const initialState = {
  invoices: [],
  currentSelectedInvoice: {} as any,
  filters: {
    status: undefined,
    search: undefined,
  },
  isEditingInvoice: false,
  invoiceStates: { 
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

// Get all invoices
export const getInvoices = createAsyncThunk(
  "invoice/getInvoices",
  async (params: any) => {
    const response = await apiClient.get("/invoice", { params });
    return response.data;
  }
);

// Get invoice by ID
export const getInvoiceById = createAsyncThunk(
  "invoice/getInvoiceById",
  async (params: any) => {
    const { id } = params;
    const response = await apiClient.get(`/invoice/${id}`);
    return response.data;
  }
);

// Create new invoice
export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (body: any, { dispatch }: any) => {
    const response = await apiClient.post("/invoice", body);
    if (response.status === 201) {
      notification.success({
        message: "Success",
        description: "Invoice created successfully",
      });
      dispatch(getInvoices({ page: 1, limit: 10 }));
      return response.data;
    }
  }
);

// Update invoice
export const updateInvoice = createAsyncThunk(
  "invoice/updateInvoice",
  async ({ body, id }: any, { dispatch }: any) => {
    const response = await apiClient.put(`/invoice/${id}`, body);
    if (response.status === 200) {
      notification.success({
        message: "Success",
        description: "Invoice updated successfully",
      });
      dispatch(getInvoices({}));
      return response.data;
    }
  }
);

// Delete invoice
export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async (params: any, { dispatch, getState }: any) => {
    const { id } = params;
    const { invoice } = getState();
    const response = await apiClient.delete(`/invoice/${id}`);
    if (response.status === 200) {
      notification.success({
        message: "Success",
        description: "Invoice deleted successfully",
      });
      dispatch(clearCurrentSelectedInvoice());
      const payload = {
        invoices: invoice?.invoices?.filter(
          (each: any) => each._id !== id
        ),
      };
      dispatch(setInvoices(payload));
    }
  }
);

export const invoiceSlice = createSlice({
  name: "invoice",
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
      .addCase(getInvoices.pending, (state) => {
        state.invoiceStates.status = "loading";
        state.invoiceStates.loading = true;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.invoiceStates.status = "succeeded";
        state.invoiceStates.loading = false;
        state.invoiceStates.error = "";
        state.invoices = action.payload?.invoices as any;
        state.pagination = action.payload?.pagination;
      })
      .addCase(getInvoices.rejected, (state) => {
        state.invoiceStates.status = "failed";
        state.invoiceStates.loading = false;
        state.invoiceStates.error = "Error";
      })
      // Get invoice by ID
      .addCase(getInvoiceById.pending, (state) => {
        state.invoiceStates.status = "loading";
        state.invoiceStates.loadingById = true;
        state.invoiceStates.error = "";
      })
      .addCase(getInvoiceById.fulfilled, (state, action) => {
        state.invoiceStates.status = "succeeded";
        state.invoiceStates.loadingById = false;
        state.invoiceStates.error = "";
        state.currentSelectedInvoice = action.payload.data;
      })
      .addCase(getInvoiceById.rejected, (state) => {
        state.invoiceStates.status = "failed";
        state.invoiceStates.loadingById = false;
        state.invoiceStates.error = "Error";
      })
      // Create invoice
      .addCase(createInvoice.pending, (state) => {
        state.invoiceStates.status = "loading";
        state.invoiceStates.loading = true;
        state.invoiceStates.error = "";
      })
      .addCase(createInvoice.fulfilled, (state) => {
        state.invoiceStates.status = "succeeded";
        state.invoiceStates.loading = false;
        state.invoiceStates.error = "";
      })
      .addCase(createInvoice.rejected, (state) => {
        state.invoiceStates.status = "failed";
        state.invoiceStates.loading = false;
        state.invoiceStates.error = "Error";
      })
      // Update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.invoiceStates.status = "loading";
        state.invoiceStates.loading = true;
        state.invoiceStates.error = "";
      })
      .addCase(updateInvoice.fulfilled, (state) => {
        state.invoiceStates.status = "succeeded";
        state.invoiceStates.loading = false;
        state.invoiceStates.error = "";
      })
      .addCase(updateInvoice.rejected, (state) => {
        state.invoiceStates.status = "failed";
        state.invoiceStates.loading = false;
        state.invoiceStates.error = "Error";
      });
  },
});

export const { actions, reducer } = invoiceSlice;
export const {
  setInvoiceFilter,
  setInvoices,
  setIsEditingInvoice,
  setCurrentSelectedInvoice,
  clearCurrentSelectedInvoice,
} = actions;

export default invoiceSlice.reducer; 