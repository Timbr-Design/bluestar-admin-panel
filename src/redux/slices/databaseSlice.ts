/* eslint-disable */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils/configureAxios";
import { notification } from "antd";
import { useAppDispatch } from "../../hooks/store";

// Bank Account APIs

export const addBankAccount = createAsyncThunk(
  "database/addBankAccount",
  async (body: any, { dispatch }) => {
    const response = await apiClient.post("/database/bank-accounts", body);

    if (response.status === 201) {
      dispatch(setOpenSidePanel(false));
      notification.success({
        message: "Success",
        description: "Added",
      });
      dispatch(getBankAccount({ page: "1", search: "", limit: 10 }));
      return response.data;
    }
  }
);

export const getBankAccount = createAsyncThunk(
  "database/getBankAccount",
  async (params: any, { dispatch }) => {
    const { page, limit, search } = params;
    const response = await apiClient.get(
      `/database/bank-accounts/?page=${page}&limit=${limit}&search=${search}`
    );
    console.log("response.data", response.data);
    if (response.status == 200) {
      // dispatch(
      //   setPagination({
      //     total: "1",
      //     page: "1",
      //     limit: "2",
      //   })
      // );
      return response.data;
    }
  }
);

export const getBankAccountById = createAsyncThunk(
  "database/getBankAccountById",

  async (params: any) => {
    const { id } = params;

    const response = await apiClient.get(`/database/bank-accounts/${id}`);

    return response.data;
  }
);

export const deleteBankAccount = createAsyncThunk(
  "database/deleteBankAccount",
  async (params: any, { dispatch }) => {
    const { id } = params;

    const response = await apiClient.delete(`/database/bank-accounts/${id}`);

    dispatch(getBankAccount({ page: "1", search: "", limit: 10 }));
    return response.data;
  }
);

export const updateBankAccount = createAsyncThunk(
  "database/updateBankAccount",

  async (body: any) => {
    const { id, payload } = body;

    const response = await apiClient.patch(
      `/database/bank-accounts/${id}`,
      payload
    );

    return response.data;
  }
);

// Duty Type APIs

export const addDutyType = createAsyncThunk(
  "database/addDutyType",
  async (body) => {
    const response = await apiClient.post("/database/duty-type", body);

    return response.data;
  }
);

// Tax APIs

export const addNewTax = createAsyncThunk(
  "database/addNewTax",
  async (body: any, { dispatch, getState }: any) => {
    const response = await apiClient.post("/database/tax", body);

    const { database } = getState().database;
    const { taxesStates } = database;
    const { pagination } = taxesStates;

    if ((response.status = 201)) {
      dispatch(setOpenSidePanel(false));
      notification.success({
        message: "Success",
        description: "Added",
      });
      dispatch(
        getTaxes({
          page: pagination.page,
          search: pagination.search,
          limit: 10,
        })
      );
      return response.data;
    }
  }
);

export const getTaxes = createAsyncThunk(
  "database/getTaxes",

  async (params: any) => {
    const { page, limit, search } = params;
    const response = await apiClient.get(
      `/database/tax/?page=${page}&limit=${limit}&search=${search}`
    );

    return response.data;
  }
);

export const getTaxesOptions = createAsyncThunk(
  "database/getTaxesOptions",

  async (params: any) => {
    const { page, size } = params;

    const response = await apiClient.get(
      `/database/tax/names?page=${page}&size=${size}`
    );

    return response.data;
  }
);

export const deleteTax = createAsyncThunk(
  "database/deleteTax",

  async (params: any, { dispatch, getState }: any) => {
    const { id } = params;
    const response = await apiClient.delete(`/database/tax/${id}`);

    const { database } = getState().database;
    const { taxesStates, q } = database;
    const { pagination } = taxesStates;

    dispatch(
      getTaxes({
        page: pagination.page,
        search: q,
      })
    );

    return response.data;
  }
);

export const updateTax = createAsyncThunk(
  "database/updateTax",
  async (body: any, { dispatch, getState }: any) => {
    const { id, payload } = body;

    const response = await apiClient.patch(`/database/tax/${id}`, payload);

    const { database } = getState().database;
    const { taxesStates, q } = database;
    const { pagination } = taxesStates;

    dispatch(
      getTaxes({
        page: pagination.page,
        search: q,
        limit: 10,
      })
    );

    return response.data;
  }
);

export const getTaxesById = createAsyncThunk(
  "database/getTaxesById",
  async (params: any) => {
    const { id } = params;

    const response = await apiClient.get(`/database/tax/${id}`);

    return response.data;
  }
);

// Customer APIs

export const addNewCustomer = createAsyncThunk(
  "database/addNewCustomer",
  async (body: any, { dispatch }) => {
    const response = await apiClient.post("/database/customer", body);
    if (response.status === 201) {
      notification.success({
        message: "Success",
        description: "Added",
      });
      dispatch(setOpenSidePanel(false));
      dispatch(getCustomer({ page: "1", search: "", limit: 10 }));
      return response.data;
    }
  }
);

export const getCustomer = createAsyncThunk(
  "database/getCustomer",
  async (params: any) => {
    const { page, limit, search } = params;

    const response = await apiClient.get(
      `/database/customer?page=${page}&limit=${limit}&search=${search}`
    );

    return response.data;
  }
);

export const updateCustomer = createAsyncThunk(
  "database/updateCustomer",
  async (body: any) => {
    const { payload, id } = body;

    const response = await apiClient.patch(`/database/customer/${id}`, payload);

    return response.data;
  }
);

export const deleteCustomer = createAsyncThunk(
  "database/deleteCustomer",
  async (body: any, { dispatch }) => {
    const { id } = body;

    dispatch(getCustomer({ page: "1", search: "", limit: 10 }));

    const response = await apiClient.delete(`/database/customer/${id}`);

    return response.data;
  }
);

export const getCustomerById = createAsyncThunk(
  "database/getCustomerById",
  async (params: any) => {
    const { id } = params;

    const response = await apiClient.get(`/database/customer/${id}`);

    return response.data;
  }
);

// Allowance APIs
export const addNewAllowance = createAsyncThunk(
  "database/addNewAllowance",
  async (body: any, { dispatch }) => {
    const response = await apiClient.post("/database/allowance", body);

    dispatch(getAllowances({ page: "1", search: "", limit: 10 }));

    return response.data;
  }
);

export const getAllowances = createAsyncThunk(
  "database/getAllowances",
  async (params: any) => {
    const { page, limit, search } = params;
    const response = await apiClient.get(
      `/database/allowance?page=${page}&limit=${limit}&search=${search}`
    );

    return response.data;
  }
);

export const getAllowanceById = createAsyncThunk(
  "database/getAllowanceById",

  async (params: any) => {
    const { id } = params;

    const response = await apiClient.get(`/database/allowance/${id}`);

    return response.data;
  }
);

export const updateAllowance = createAsyncThunk(
  "database/updateAllowance",

  async (body: any, { dispatch }) => {
    const { payload, id } = body;

    const response = await apiClient.patch(
      `/database/allowance/${id}`,
      payload
    );

    dispatch(getAllowances({ page: "1", search: "", limit: 10 }));

    return response.data;
  }
);

export const deleteAllowance = createAsyncThunk(
  "database/deleteAllowance",

  async (params: any, { dispatch }) => {
    const { id } = params;

    const response = await apiClient.delete(`/database/allowance/${id}`);

    dispatch(getAllowances({ page: "1", search: "", limit: 10 }));

    return response.data;
  }
);

// Vehicle APIs
export const addNewVehicle = createAsyncThunk(
  "database/addNewVehicle",
  async (body: any, { dispatch }) => {
    const response = await apiClient.post("/database/vehicle", body);

    dispatch(getVehicle({ page: "1", search: "", limit: 10 }));
    return response.data;
  }
);

export const getVehicle = createAsyncThunk(
  "database/getVehicle",

  async (params: any, { dispatch, getState }: any) => {
    // const { page, limit, search } = params;
    // const response = await apiClient.get(
    //   `/database/vehicle?page=${page}&limit=${limit}&search=${search}`
    // );
    const response = await apiClient.get(`/database/vehicle`, { params });

    if (response.status === 200) {
      return response.data;
    }
  }
);

export const getVehicleById = createAsyncThunk(
  "database/getVehicleById",

  async (params: any) => {
    const { id } = params;

    const response = await apiClient.get(`/database/vehicle/${id}`);

    return response.data;
  }
);

export const updateVehicle = createAsyncThunk(
  "database/updateVehicle",

  async (body: any) => {
    const { payload, id } = body;
    const response = await apiClient.patch(`/database/vehicle/${id}`, payload);

    return response.data;
  }
);

export const deleteVehicle = createAsyncThunk(
  "database/deleteVehicle",

  async (body: any, { dispatch }) => {
    const { id } = body;
    const response = await apiClient.delete(`/database/vehicle/${id}`);

    dispatch(getVehicle({ page: "1", search: "", limit: 10 }));
    return response.data;
  }
);

// Driver APIs
export const addNewDriver = createAsyncThunk(
  "database/addNewDriver",
  async (body: any, { dispatch, getState }: any) => {
    const response = await apiClient.post("/database/driver", body);

    const { database } = getState().database;
    const { driverStates } = database;
    const { pagination } = driverStates;

    dispatch(
      getDrivers({
        page: pagination?.page,
        search: pagination?.search,
        limit: pagination?.limit,
      })
    );

    return response.data;
  }
);

export const getDrivers = createAsyncThunk(
  "database/getDrivers",
  async (params: any, { dispatch, getState }: any) => {
    // const { page, limit, search } = params;

    const response = await apiClient.get(`/database/driver`, { params });
    // const response = await apiClient.get(
    //   `/database/driver?page=${page}&limit=${limit}&search=${search}`
    // );

    if (response.status === 200) {
      let option: Array<object> = response?.data?.data?.map((each: any) => ({
        value: each._id,
        label: each.name,
      }));

      dispatch(setDriverOption(option));
      return response.data;
    }
  }
);

export const getDriverById = createAsyncThunk(
  "database/getDriverById",

  async (params: any) => {
    const { id } = params;

    const response = await apiClient.get(`/database/driver/${id}`);

    return response.data;
  }
);

export const updateDriver = createAsyncThunk(
  "database/updateDriver",

  async (body: any, { dispatch, getState }: any) => {
    const { payload, id } = body;

    const response = await apiClient.patch(`/database/driver/${id}`, payload);

    const { database } = getState().database;
    const { driverStates, pagination } = database;
    // const { pagination } = driverStates;

    dispatch(
      getDrivers({
        page: pagination?.page,
        search: pagination?.search,
        limit: pagination?.limit,
      })
    );
    return response.data;
  }
);

export const deleteDriver = createAsyncThunk(
  "database/deleteDriver",

  async (params: any, { dispatch, getState }: any) => {
    const { id } = params;

    const response = await apiClient.delete(`/database/driver/${id}`);

    const { database } = getState().database;
    const { driverStates } = database;
    const { pagination } = driverStates;

    dispatch(
      getDrivers({
        page: pagination?.page,
        search: pagination?.search,
        limit: pagination?.limit,
      })
    );
    return response.data;
  }
);

// Vehicle Group CRUD
export const addVehicleGroup = createAsyncThunk(
  "database/addVehicleGroup",
  async (body: any, { dispatch }) => {
    const response = await apiClient.post("/database/vehicle-group", body);

    if (response.status === 201) {
      dispatch(setOpenSidePanel(false));
      notification.success({
        message: "Success",
        description: "Added",
      });
      dispatch(getVehicleGroup({ page: "1", search: "", limit: 10 }));
      return response.data;
    }
  }
);

export const getVehicleGroup = createAsyncThunk(
  "database/getVehicleGroup",

  async (params: any, { dispatch, getState }) => {
    // const { page, limit, search } = params;

    // const response = await apiClient.get(
    //   `/database/vehicle-group?page=${page}&limit=${limit}&search=${search}`
    // );

    const response = await apiClient.get(`/database/vehicle-group`, { params });

    if (response.status === 200) {
      let option: Array<object> = response?.data?.data?.map((each: any) => ({
        value: each._id,
        label: each.name,
      }));

      dispatch(setVehicleGroupOption(option));
      return response.data;
    }

    return response.data;
  }
);

export const getVehicleGroupById = createAsyncThunk(
  "database/getVehicleGroupById",

  async (params: any) => {
    const { id } = params;

    const response = await apiClient.get(`/database/vehicle-group/${id}`);

    return response.data;
  }
);

export const deleteVehicleGroup = createAsyncThunk(
  "database/deleteVehicleGroup",

  async (params: any, { dispatch }) => {
    const { id } = params;

    const response = await apiClient.delete(`/database/vehicle-group/${id}`);

    dispatch(getVehicleGroup({ page: "1", search: "", limit: 10 }));

    return response.data;
  }
);

export const getVehicleGroupOptions = createAsyncThunk(
  "database/getVehicleGroupOptions",

  async (params: any) => {
    const { page, size } = params;

    const response = await apiClient.get(
      `/database/vehicle-group/names?page=${page}&size=${size}`
    );

    return response.data;
  }
);

export const updateVehicleGroup = createAsyncThunk(
  "database/updateVehicleGroup",

  async (body: any) => {
    const { payload, id } = body;

    const response = await apiClient.patch(
      `/database/vehicle-group/${id}`,
      payload
    );
    return response.data;
  }
);

const initialState: any = {
  // Global
  q: "",
  openSidePanel: false,
  pagination: {
    total: null,
    page: 1,
    limit: 10,
  },

  // Vehicle Group

  vehicleGroupData: {},
  selectedVehicleGroup: {},
  vehicleGroupStates: {
    status: "idle",
    loading: false,
    pagination: { page: 1, total: "", limit: 10 },
    error: "",
  },
  deleteVehicleGroupStates: {
    status: "idle",
    loading: false,
    error: "",
  },
  updateVehicleGroupStates: {
    status: "idle",
    loading: false,
    error: "",
  },

  // Vehicle Group Option
  vehicleGroupOption: {},
  vehicleGroupSelectOption: [],
  vehicleGroupOptionStates: {
    status: "idle",
    loading: false,
    error: "",
  },

  // Customer
  customers: {},
  selectedCustomer: {},
  customersStates: {
    status: "idle",
    loading: false,
    pagination: { page: 1, total: "", limit: 10 },
    error: "",
  },
  deleteCustomersStates: {
    status: "idle",
    loading: false,
    error: "",
  },
  updateCustomersStates: {
    status: "idle",
    loading: false,
    error: "",
  },

  // Taxes
  taxes: {},
  selectedTax: {},
  taxesStates: {
    status: "idle",
    loading: false,
    pagination: { page: 1, total: "", limit: 10 },
    error: "",
  },
  deleteTaxesState: {
    status: "idle",
    loading: false,
    error: "",
  },
  updateTaxesState: {
    status: "idle",
    loading: false,
    error: "",
  },

  // Taxes Options
  taxesOptions: {},
  taxesOptionsStates: {
    status: "idle",
    loading: false,
    error: "",
  },

  // Bank Accounts
  bankAccounts: [],
  selectedBankAccount: {},
  bankAccountStates: {
    state: "idle",
    loading: false,
    pagination: { page: 1, total: "", limit: 7 },
    error: "",
  },
  deleteBankAccountStates: { state: "idle", loading: false, error: "" },
  updateBankAccountState: { state: "idle", loading: false, error: "" },

  // Vehicle
  vehicleList: [],
  selectedVehicle: {},
  vehicleStates: {
    state: "idle",
    loading: false,
    error: "",
    pagination: { page: 1, total: "", limit: 7 },
  },
  deleteVehicleStates: { state: "idle", loading: false, error: "" },
  updateVehicleStates: { state: "idle", loading: false, error: "" },

  // Drivers
  driverList: [],
  driverOption: [],
  selectedDriver: {},
  driverStates: {
    state: "idle",
    loading: false,
    error: "",
    pagination: { page: 1, total: "", limit: 7 },
  },

  deleteDriverStates: { state: "idle", loading: false, error: "" },
  updateDriverStates: { state: "idle", loading: false, error: "" },

  // Allowances
  allowancesList: {},
  selectedAllowance: {},
  allowanceStates: {
    state: "idle",
    loading: false,
    error: "",
    pagination: { page: 1, total: "", limit: 7 },
  },
  deleteAllowancesStates: { state: "idle", loading: false, error: "" },
  updateAllowancesStates: { state: "idle", loading: false, error: "" },
};

export const databaseSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    setQueryForSearch: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        q: action.payload,
      };
    },
    setOpenSidePanel: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        openSidePanel: action.payload,
      };
    },
    setDriverOption: (state, action: PayloadAction<Array<object>>) => {
      return {
        ...state,
        driverOption: action.payload,
      };
    },
    setVehicleGroupOption: (state, action: PayloadAction<Array<object>>) => {
      return {
        ...state,
        vehicleGroupSelectOption: action.payload,
      };
    },
    setPagination: (state, action: PayloadAction<object>) => {
      return {
        ...state,
        pagination: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create a New Vehicle Group
      .addCase(addVehicleGroup.pending, (state) => {
        state.vehicleGroupStates.status = "loading";
        state.vehicleGroupStates.loading = true;
      })
      .addCase(addVehicleGroup.fulfilled, (state) => {
        state.vehicleGroupStates.status = "succeeded";
        state.vehicleGroupStates.loading = false;
        state.vehicleGroupStates.error = "";
      })
      .addCase(addVehicleGroup.rejected, (state) => {
        state.vehicleGroupStates.status = "failed";
        state.vehicleGroupStates.loading = false;
        state.vehicleGroupStates.error = "Error";
      })

      // Get Vehicle Group
      .addCase(getVehicleGroup.pending, (state) => {
        state.vehicleGroupStates.status = "loading";
        state.vehicleGroupStates.loading = true;
      })
      .addCase(getVehicleGroup.fulfilled, (state, action) => {
        state.vehicleGroupStates.status = "succeeded";
        state.vehicleGroupStates.loading = false;
        state.vehicleGroupStates.error = "";
        state.vehicleGroupData = action.payload;
        state.vehicleGroupData.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        };
      })
      .addCase(getVehicleGroup.rejected, (state) => {
        state.vehicleGroupStates.status = "failed";
        state.vehicleGroupStates.loading = false;
        state.vehicleGroupStates.error = "Error";
      })

      // Get Vehicle Group By Id
      .addCase(getVehicleGroupById.pending, (state) => {
        state.vehicleGroupStates.status = "loading";
        state.vehicleGroupStates.loading = true;
      })

      .addCase(getVehicleGroupById.fulfilled, (state, action) => {
        state.vehicleGroupStates.status = "succeeded";
        state.vehicleGroupStates.loading = false;
        state.vehicleGroupStates.error = "";
        state.selectedVehicleGroup = action.payload;
      })

      .addCase(getVehicleGroupById.rejected, (state) => {
        state.vehicleGroupStates.status = "failed";
        state.vehicleGroupStates.loading = false;
        state.vehicleGroupStates.error = "Error";
      })

      // Get Vehicle Group Options
      .addCase(getVehicleGroupOptions.pending, (state) => {
        state.vehicleGroupOptionStates.status = "loading";
        state.vehicleGroupOptionStates.loading = true;
        state.vehicleGroupOptionStates.error = "";
      })
      .addCase(getVehicleGroupOptions.fulfilled, (state, action) => {
        state.vehicleGroupOptionStates.status = "succeeded";
        state.vehicleGroupOptionStates.loading = false;
        state.vehicleGroupOptionStates.error = "";
        state.vehicleGroupOption = action.payload;
      })
      .addCase(getVehicleGroupOptions.rejected, (state) => {
        state.vehicleGroupOptionStates.status = "failed";
        state.vehicleGroupOptionStates.loading = false;
        state.vehicleGroupOptionStates.error = "Error";
      })

      // Delete the Vehicle Group
      .addCase(deleteVehicleGroup.pending, (state) => {
        state.deleteVehicleGroupStates.status = "loading";
        state.deleteVehicleGroupStates.loading = true;
        state.deleteVehicleGroupStates.error = "";
      })
      .addCase(deleteVehicleGroup.fulfilled, (state) => {
        state.deleteVehicleGroupStates.status = "succeeded";
        state.deleteVehicleGroupStates.loading = false;
        state.deleteVehicleGroupStates.error = "";
      })
      .addCase(deleteVehicleGroup.rejected, (state) => {
        state.deleteVehicleGroupStates.status = "failed";
        state.deleteVehicleGroupStates.loading = false;
        state.deleteVehicleGroupStates.error = "Error";
      })

      // Update the Vehicle Group
      .addCase(updateVehicleGroup.pending, (state) => {
        state.updateVehicleGroupStates.status = "loading";
        state.updateVehicleGroupStates.loading = true;
        state.updateVehicleGroupStates.error = "";
      })
      .addCase(updateVehicleGroup.fulfilled, (state) => {
        state.updateVehicleGroupStates.status = "succeeded";
        state.updateVehicleGroupStates.loading = false;
        state.updateVehicleGroupStates.error = "";
      })
      .addCase(updateVehicleGroup.rejected, (state) => {
        state.updateVehicleGroupStates.status = "failed";
        state.updateVehicleGroupStates.loading = false;
        state.updateVehicleGroupStates.error = "Error";
      })

      // Add the customer
      .addCase(addNewCustomer.pending, (state) => {
        state.customersStates.status = "loading";
        state.customersStates.loading = true;
        state.customersStates.error = "";
      })
      .addCase(addNewCustomer.fulfilled, (state) => {
        state.customersStates.status = "succeeded";
        state.customersStates.loading = false;
        state.customersStates.error = "";
      })
      .addCase(addNewCustomer.rejected, (state) => {
        state.customersStates.status = "failed";
        state.customersStates.loading = false;
        state.customersStates.error = "Error";
      })

      // Get the customers List
      .addCase(getCustomer.pending, (state) => {
        state.customersStates.status = "loading";
        state.customersStates.loading = true;
        state.customersStates.error = "";
      })
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.customersStates.status = "succeeded";
        state.customersStates.loading = false;
        state.customersStates.error = "";
        state.customers = action.payload;
        state.customersStates.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        };
      })
      .addCase(getCustomer.rejected, (state) => {
        state.customersStates.status = "failed";
        state.customersStates.loading = false;
        state.customersStates.error = "Error";
      })

      // Get Customer By Id
      .addCase(getCustomerById.pending, (state) => {
        state.customersStates.status = "loading";
        state.customersStates.loading = true;
        state.customersStates.error = "";
      })
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.customersStates.status = "succeeded";
        state.customersStates.loading = false;
        state.customersStates.error = "";
        state.selectedCustomer = action.payload;
      })
      .addCase(getCustomerById.rejected, (state) => {
        state.customersStates.status = "failed";
        state.customersStates.loading = false;
        state.customersStates.error = "Error";
      })

      //Delete Customers
      .addCase(deleteCustomer.pending, (state) => {
        state.deleteCustomersStates.status = "loading";
        state.deleteCustomersStates.loading = true;
        state.deleteCustomersStates.error = "";
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.deleteCustomersStates.status = "succeeded";
        state.deleteCustomersStates.loading = false;
        state.deleteCustomersStates.error = "";
      })
      .addCase(deleteCustomer.rejected, (state) => {
        state.deleteCustomersStates.status = "failed";
        state.deleteCustomersStates.loading = false;
        state.deleteCustomersStates.error = "Error";
      })

      // Update the customer
      .addCase(updateCustomer.pending, (state) => {
        state.updateCustomersStates.status = "loading";
        state.updateCustomersStates.loading = true;
        state.updateCustomersStates.error = "";
      })
      .addCase(updateCustomer.fulfilled, (state) => {
        state.updateCustomersStates.status = "succeeded";
        state.updateCustomersStates.loading = false;
        state.updateCustomersStates.error = "";
      })
      .addCase(updateCustomer.rejected, (state) => {
        state.updateCustomersStates.status = "failed";
        state.updateCustomersStates.loading = false;
        state.updateCustomersStates.error = "Error";
      })

      // Add Taxes
      .addCase(addNewTax.pending, (state) => {
        state.updateTaxesState.status = "loading";
        state.updateTaxesState.loading = true;
        state.updateTaxesState.error = "";
      })
      .addCase(addNewTax.fulfilled, (state) => {
        state.updateTaxesState.status = "succeeded";
        state.updateTaxesState.loading = false;
        state.updateTaxesState.error = "";
      })
      .addCase(addNewTax.rejected, (state) => {
        state.updateTaxesState.status = "failed";
        state.updateTaxesState.loading = false;
        state.updateTaxesState.error = "Error";
      })

      // Get Taxes
      .addCase(getTaxes.pending, (state) => {
        state.taxesStates.status = "loading";
        state.taxesStates.loading = true;
        state.taxesStates.error = "Error";
      })
      .addCase(getTaxes.fulfilled, (state, action) => {
        state.taxesStates.status = "succeeded";
        state.taxesStates.loading = false;
        state.taxesStates.error = "";
        state.taxes = action.payload;
        state.taxesStates.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        };
      })
      .addCase(getTaxes.rejected, (state) => {
        state.taxesStates.status = "failed";
        state.taxesStates.loading = false;
        state.taxesStates.error = "Error";
      })

      // Get Taxes By Id
      .addCase(getTaxesById.pending, (state) => {
        state.taxesStates.status = "loading";
        state.taxesStates.loading = true;
        state.taxesStates.error = "Error";
      })
      .addCase(getTaxesById.fulfilled, (state, action) => {
        state.taxesStates.status = "succeeded";
        state.taxesStates.loading = false;
        state.taxesStates.error = "";
        state.selectedTax = action.payload;
      })
      .addCase(getTaxesById.rejected, (state) => {
        state.taxesStates.status = "failed";
        state.taxesStates.loading = false;
        state.taxesStates.error = "Error";
      })

      // Get Taxes Options
      .addCase(getTaxesOptions.pending, (state) => {
        state.taxesStates.status = "loading";
        state.taxesStates.loading = true;
        state.taxesStates.error = "Error";
      })
      .addCase(getTaxesOptions.fulfilled, (state, action) => {
        state.taxesStates.status = "succeeded";
        state.taxesStates.loading = false;
        state.taxesStates.error = "";
        state.taxesOptions = action.payload;
      })
      .addCase(getTaxesOptions.rejected, (state) => {
        state.taxesStates.status = "failed";
        state.taxesStates.loading = false;
        state.taxesStates.error = "Error";
      })

      // Update Taxes
      .addCase(updateTax.pending, (state) => {
        state.updateTaxesState.status = "loading";
        state.updateTaxesState.loading = true;
        state.updateTaxesState.error = "Error";
      })
      .addCase(updateTax.fulfilled, (state) => {
        state.updateTaxesState.status = "succeeded";
        state.updateTaxesState.loading = false;
        state.updateTaxesState.error = "";
      })
      .addCase(updateTax.rejected, (state) => {
        state.updateTaxesState.status = "failed";
        state.updateTaxesState.loading = false;
        state.updateTaxesState.error = "Error";
      })

      // Delete Tax
      .addCase(deleteTax.pending, (state) => {
        state.deleteTaxesState.status = "loading";
        state.deleteTaxesState.loading = true;
        state.deleteTaxesState.error = "Error";
      })
      .addCase(deleteTax.fulfilled, (state) => {
        state.deleteTaxesState.status = "succeeded";
        state.deleteTaxesState.loading = false;
        state.deleteTaxesState.error = "";
      })
      .addCase(deleteTax.rejected, (state) => {
        state.deleteTaxesState.status = "failed";
        state.deleteTaxesState.loading = false;
        state.deleteTaxesState.error = "Error";
      })

      // Add Bank Account
      .addCase(addBankAccount.pending, (state) => {
        state.bankAccountStates.status = "loading";
        state.bankAccountStates.loading = true;
        state.bankAccountStates.error = "";
      })
      .addCase(addBankAccount.fulfilled, (state, action) => {
        state.bankAccountStates.status = "succeeded";
        state.bankAccountStates.loading = false;
        state.bankAccountStates.error = "";
      })
      .addCase(addBankAccount.rejected, (state) => {
        state.bankAccountStates.status = "failed";
        state.bankAccountStates.loading = false;
        state.bankAccountStates.error = "Error";
      })

      // Get Bank Account
      .addCase(getBankAccount.pending, (state) => {
        state.bankAccountStates.status = "loading";
        state.bankAccountStates.loading = true;
        state.bankAccountStates.error = "";
      })
      .addCase(getBankAccount.fulfilled, (state, action) => {
        state.bankAccountStates.status = "succeeded";
        state.bankAccountStates.loading = false;
        state.bankAccountStates.error = "";
        state.bankAccounts = action.payload;
      })
      .addCase(getBankAccount.rejected, (state) => {
        state.bankAccountStates.status = "failed";
        state.bankAccountStates.loading = false;
        state.bankAccountStates.error = "Error";
      })

      // Get Bank Account By Id
      .addCase(getBankAccountById.pending, (state) => {
        state.bankAccountStates.status = "loading";
        state.bankAccountStates.loading = true;
        state.bankAccountStates.error = "";
      })
      .addCase(getBankAccountById.fulfilled, (state, action) => {
        state.bankAccountStates.status = "succeeded";
        state.bankAccountStates.loading = false;
        state.bankAccountStates.error = "";
        state.selectedBankAccount = action.payload;
      })
      .addCase(getBankAccountById.rejected, (state) => {
        state.bankAccountStates.status = "failed";
        state.bankAccountStates.loading = false;
        state.bankAccountStates.error = "Error";
      })

      // Update Bank Account
      .addCase(updateBankAccount.pending, (state) => {
        state.updateBankAccountState.status = "loading";
        state.updateBankAccountState.loading = true;
        state.updateBankAccountState.error = "";
      })
      .addCase(updateBankAccount.fulfilled, (state) => {
        state.updateBankAccountState.status = "succeeded";
        state.updateBankAccountState.loading = false;
        state.updateBankAccountState.error = "";
      })
      .addCase(updateBankAccount.rejected, (state) => {
        state.updateBankAccountState.status = "failed";
        state.updateBankAccountState.loading = false;
        state.updateBankAccountState.error = "Error";
      })

      // Delete Bank Account
      .addCase(deleteBankAccount.pending, (state) => {
        state.deleteBankAccountStates.status = "loading";
        state.deleteBankAccountStates.loading = true;
        state.deleteBankAccountStates.error = "";
      })
      .addCase(deleteBankAccount.fulfilled, (state) => {
        state.deleteBankAccountStates.status = "succeeded";
        state.deleteBankAccountStates.loading = false;
        state.deleteBankAccountStates.error = "";
      })
      .addCase(deleteBankAccount.rejected, (state) => {
        state.deleteBankAccountStates.status = "failed";
        state.deleteBankAccountStates.loading = false;
        state.deleteBankAccountStates.error = "Error";
      })

      // Add New Vehicle
      .addCase(addNewVehicle.pending, (state) => {
        state.vehicleStates.status = "loading";
        state.vehicleStates.loading = true;
        state.vehicleStates.error = "";
      })
      .addCase(addNewVehicle.fulfilled, (state) => {
        state.vehicleStates.status = "succeeded";
        state.vehicleStates.loading = false;
        state.vehicleStates.error = "";
      })
      .addCase(addNewVehicle.rejected, (state) => {
        state.vehicleStates.status = "failed";
        state.vehicleStates.loading = false;
        state.vehicleStates.error = "Error";
      })

      // Get Vehicle List

      .addCase(getVehicle.pending, (state) => {
        state.vehicleStates.status = "loading";
        state.vehicleStates.loading = true;
        state.vehicleStates.error = "";
      })
      .addCase(getVehicle.fulfilled, (state, action) => {
        state.vehicleStates.status = "succeeded";
        state.vehicleStates.loading = false;
        state.vehicleStates.error = "";
        state.vehicleList = action.payload;
      })
      .addCase(getVehicle.rejected, (state) => {
        state.vehicleStates.status = "failed";
        state.vehicleStates.loading = false;
        state.vehicleStates.error = "Error";
      })

      // Update Vehicle List

      .addCase(updateVehicle.pending, (state) => {
        state.updateVehicleStates.status = "loading";
        state.updateVehicleStates.loading = true;
        state.updateVehicleStates.error = "";
      })
      .addCase(updateVehicle.fulfilled, (state) => {
        state.updateVehicleStates.status = "succeeded";
        state.updateVehicleStates.loading = false;
        state.updateVehicleStates.error = "";
      })
      .addCase(updateVehicle.rejected, (state) => {
        state.updateVehicleStates.status = "failed";
        state.updateVehicleStates.loading = false;
        state.updateVehicleStates.error = "Error";
      })

      // Delete Vehicle List
      .addCase(deleteVehicle.pending, (state) => {
        state.deleteVehicleStates.status = "loading";
        state.deleteVehicleStates.loading = true;
        state.deleteVehicleStates.error = "";
      })
      .addCase(deleteVehicle.fulfilled, (state) => {
        state.deleteVehicleStates.status = "succeeded";
        state.deleteVehicleStates.loading = false;
        state.deleteVehicleStates.error = "";
      })
      .addCase(deleteVehicle.rejected, (state) => {
        state.deleteVehicleStates.status = "failed";
        state.deleteVehicleStates.loading = false;
        state.deleteVehicleStates.error = "Error";
      })

      // Add Driver
      .addCase(addNewDriver.pending, (state) => {
        state.driverStates.status = "loading";
        state.driverStates.loading = true;
        state.driverStates.error = "";
      })
      .addCase(addNewDriver.fulfilled, (state) => {
        state.driverStates.status = "succeeded";
        state.driverStates.loading = false;
        state.driverStates.error = "";
      })
      .addCase(addNewDriver.rejected, (state) => {
        state.driverStates.status = "failed";
        state.driverStates.loading = false;
        state.driverStates.error = "Error";
      })

      // Get Drivers
      .addCase(getDrivers.pending, (state) => {
        state.driverStates.status = "loading";
        state.driverStates.loading = true;
        state.driverStates.error = "";
      })
      .addCase(getDrivers.fulfilled, (state, action) => {
        state.driverStates.status = "succeeded";
        state.driverStates.loading = false;
        state.driverList = action.payload;
        state.driverStates.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        };
        state.driverStates.error = "";
      })
      .addCase(getDrivers.rejected, (state) => {
        state.driverStates.status = "failed";
        state.driverStates.loading = false;
        state.driverStates.error = "Error";
      })

      // Get Driver By Id
      .addCase(getDriverById.pending, (state) => {
        state.driverStates.status = "loading";
        state.driverStates.loading = true;
        state.driverStates.error = "";
      })
      .addCase(getDriverById.fulfilled, (state, action) => {
        state.driverStates.status = "succeeded";
        state.driverStates.loading = false;
        state.selectedDriver = action.payload;
        state.driverStates.error = "";
      })
      .addCase(getDriverById.rejected, (state) => {
        state.driverStates.status = "failed";
        state.driverStates.loading = false;
        state.driverStates.error = "Error";
      })

      // Delete Driver
      .addCase(deleteDriver.pending, (state) => {
        state.deleteDriverStates.status = "loading";
        state.deleteDriverStates.loading = true;
        state.deleteDriverStates.error = "";
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.deleteDriverStates.status = "succeeded";
        state.deleteDriverStates.loading = false;
        state.deleteDriverStates.error = "";
      })
      .addCase(deleteDriver.rejected, (state) => {
        state.deleteDriverStates.status = "failed";
        state.deleteDriverStates.loading = false;
        state.deleteDriverStates.error = "Error";
      })

      // Update Driver
      .addCase(updateDriver.pending, (state) => {
        state.updateDriverStates.status = "loading";
        state.updateDriverStates.loading = true;
        state.updateDriverStates.error = "";
      })
      .addCase(updateDriver.fulfilled, (state) => {
        state.updateDriverStates.status = "succeeded";
        state.updateDriverStates.loading = false;
        state.updateDriverStates.error = "";
      })
      .addCase(updateDriver.rejected, (state) => {
        state.updateDriverStates.status = "failed";
        state.updateDriverStates.loading = false;
        state.updateDriverStates.error = "Error";
      })

      // Add allowance
      .addCase(addNewAllowance.pending, (state) => {
        state.allowanceStates.status = "loading";
        state.allowanceStates.loading = true;
        state.allowanceStates.error = "";
      })
      .addCase(addNewAllowance.fulfilled, (state) => {
        state.allowanceStates.status = "succeeded";
        state.allowanceStates.loading = false;
        state.allowanceStates.error = "";
      })
      .addCase(addNewAllowance.rejected, (state) => {
        state.allowanceStates.status = "failed";
        state.allowanceStates.loading = false;
        state.allowanceStates.error = "Error";
      })

      // Get Allowances
      .addCase(getAllowances.pending, (state) => {
        state.allowanceStates.status = "loading";
        state.allowanceStates.loading = true;
        state.allowanceStates.error = "";
      })
      .addCase(getAllowances.fulfilled, (state, action) => {
        state.allowanceStates.status = "succeeded";
        state.allowanceStates.loading = false;
        state.allowanceStates.error = "";
        state.allowancesList = action.payload;
      })
      .addCase(getAllowances.rejected, (state) => {
        state.allowanceStates.status = "failed";
        state.allowanceStates.loading = false;
        state.allowanceStates.error = "Error";
      })

      // Get Allowances By Id
      .addCase(getAllowanceById.pending, (state) => {
        state.allowanceStates.status = "loading";
        state.allowanceStates.loading = true;
        state.allowanceStates.error = "";
      })
      .addCase(getAllowanceById.fulfilled, (state, action) => {
        state.allowanceStates.status = "succeeded";
        state.allowanceStates.loading = false;
        state.allowanceStates.error = "";
        state.selectedAllowance = action.payload;
      })
      .addCase(getAllowanceById.rejected, (state) => {
        state.allowanceStates.status = "failed";
        state.allowanceStates.loading = false;
        state.allowanceStates.error = "Error";
      })

      // Delete Allowance
      .addCase(deleteAllowance.pending, (state) => {
        state.deleteAllowancesStates.status = "loading";
        state.deleteAllowancesStates.loading = true;
        state.deleteAllowancesStates.error = "";
      })
      .addCase(deleteAllowance.fulfilled, (state) => {
        state.deleteAllowancesStates.status = "succeeded";
        state.deleteAllowancesStates.loading = false;
        state.deleteAllowancesStates.error = "";
      })
      .addCase(deleteAllowance.rejected, (state) => {
        state.deleteAllowancesStates.status = "failed";
        state.deleteAllowancesStates.loading = false;
        state.deleteAllowancesStates.error = "Error";
      })

      // Update Allowance
      .addCase(updateAllowance.pending, (state) => {
        state.updateAllowancesStates.status = "loading";
        state.updateAllowancesStates.loading = true;
        state.updateAllowancesStates.error = "";
      })
      .addCase(updateAllowance.fulfilled, (state) => {
        state.updateAllowancesStates.status = "succeeded";
        state.updateAllowancesStates.loading = false;
        state.updateAllowancesStates.error = "";
      })
      .addCase(updateAllowance.rejected, (state) => {
        state.updateAllowancesStates.status = "failed";
        state.updateAllowancesStates.loading = false;
        state.updateAllowancesStates.error = "Error";
      });
  },
});
export const { actions, reducer } = databaseSlice;
export const {
  setQueryForSearch,
  setOpenSidePanel,
  setDriverOption,
  setVehicleGroupOption,
  setPagination,
} = actions;

export default databaseSlice.reducer;
