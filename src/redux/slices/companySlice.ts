/* eslint-disable */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";

interface ICompanyDetails {
  businessType: string;
  gstInNumber: string;
  serviceTaxNumber: string;
  cinNumber: string;
  cstTinNumber: string;
  _id?: string;
}

interface ISignature {
  fileUrl: string;
  fileType: string;
  fileSize: number;
  _id?: string;
}

interface ICompany {
  _id: string;
  companyName: string;
  phoneNumber: string;
  emailId: string;
  address: string;
  details: ICompanyDetails;
  dutySlipTc: string;
  signature: ISignature;
  notes: string;
  isActive: boolean;
}

interface IGetCompaniesResponse {
  data: ICompany[];
}

interface IGetCompanyResponse {
  data: ICompany;
}

interface ICompanyState {
  companies: ICompany[];
  currentCompany: ICompany | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: ICompanyState = {
  companies: [],
  currentCompany: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Get Companies
export const getCompanies = createAsyncThunk(
  "company/getCompanies",
  async (params: { page: number; limit: number; status?: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IGetCompaniesResponse>("/setting/company", { params });
      if (response.status === 200) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch companies");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch companies");
    }
  }
);

// Get Company by ID
export const getCompanyById = createAsyncThunk(
  "company/getCompanyById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<IGetCompanyResponse>(`/setting/company/${id}`);
      if (response.status === 200) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch company");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch company");
    }
  }
);

// Create Company
export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (companyData: Omit<ICompany, "_id">, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/setting/company", companyData);
      if (response.status === 201) {
        return response.data;
      }
      return rejectWithValue("Failed to create company");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create company");
    }
  }
);

// Update Company
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ id, companyData }: { id: string; companyData: Partial<ICompany> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/setting/company/${id}`, companyData);
      if (response.status === 200) {
        return response.data;
      }
      return rejectWithValue("Failed to update company");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update company");
    }
  }
);

// Delete Company
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/setting/company/${id}`);
      if (response.status === 200) {
        return id;
      }
      return rejectWithValue("Failed to delete company");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete company");
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCompany: (state) => {
      state.currentCompany = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Companies
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.data;
        state.error = null;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Company by ID
      .addCase(getCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompany = action.payload.data;
        state.error = null;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Company
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload.data);
        state.error = null;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.companies.findIndex(company => company._id === action.payload.data._id);
        if (index !== -1) {
          state.companies[index] = action.payload.data;
        }
        if (state.currentCompany?._id === action.payload.data._id) {
          state.currentCompany = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Company
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(company => company._id !== action.payload);
        if (state.currentCompany?._id === action.payload) {
          state.currentCompany = null;
        }
        state.error = null;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentCompany } = companySlice.actions;
export default companySlice.reducer; 