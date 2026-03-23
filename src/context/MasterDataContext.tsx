import React, { createContext, useContext, useMemo, useReducer } from 'react';

type MasterFeatureKey = 'categories' | 'streams';

interface FeatureRequestState {
  loading: boolean;
  saving: boolean;
  deletingId: number | null;
  error: string | null;
  successMessage: string | null;
  pendingDeleteId: number | null;
  pendingDeleteLabel: string | null;
}

type MasterDataState = Record<MasterFeatureKey, FeatureRequestState>;

type FeatureAction =
  | { type: 'FETCH_START'; feature: MasterFeatureKey }
  | { type: 'FETCH_SUCCESS'; feature: MasterFeatureKey }
  | { type: 'SAVE_START'; feature: MasterFeatureKey }
  | { type: 'SAVE_SUCCESS'; feature: MasterFeatureKey; message: string }
  | { type: 'DELETE_START'; feature: MasterFeatureKey; id: number }
  | { type: 'DELETE_SUCCESS'; feature: MasterFeatureKey; message: string }
  | { type: 'REQUEST_ERROR'; feature: MasterFeatureKey; message: string }
  | { type: 'CLEAR_SUCCESS'; feature: MasterFeatureKey }
  | { type: 'SET_PENDING_DELETE'; feature: MasterFeatureKey; id: number | null; label: string | null }
  | { type: 'RESET_DELETE_STATE'; feature: MasterFeatureKey };

interface MasterDataContextValue {
  state: MasterDataState;
  dispatch: React.Dispatch<FeatureAction>;
}

const createInitialFeatureState = (): FeatureRequestState => ({
  loading: false,
  saving: false,
  deletingId: null,
  error: null,
  successMessage: null,
  pendingDeleteId: null,
  pendingDeleteLabel: null,
});

const initialState: MasterDataState = {
  categories: createInitialFeatureState(),
  streams: createInitialFeatureState(),
};

const reducer = (state: MasterDataState, action: FeatureAction): MasterDataState => {
  const featureState = state[action.feature];

  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        [action.feature]: {
          ...featureState,
          loading: true,
          error: null,
        },
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        [action.feature]: {
          ...featureState,
          loading: false,
          error: null,
        },
      };
    case 'SAVE_START':
      return {
        ...state,
        [action.feature]: {
          ...featureState,
          saving: true,
          error: null,
          successMessage: null,
        },
      };
    case 'SAVE_SUCCESS':
      return {
        ...state,
        [action.feature]: {
          ...featureState,
          saving: false,
          error: null,
          successMessage: action.message,
        },
      };
    case 'DELETE_START':
      return {
        ...state,
        [action.feature]: {
          ...featureState,
          deletingId: action.id,
          error: null,
          successMessage: null,
        },
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        [action.feature]: {
          ...featureState,
          deletingId: null,
          pendingDeleteId: null,
          pendingDeleteLabel: null,
          error: null,
          successMessage: action.message,
        },
      };
    case 'REQUEST_ERROR':
      return {
        ...state,
        [action.feature]: {
          ...featureState,
          loading: false,
          saving: false,
          deletingId: null,
          error: action.message,
        },
      };
    case 'CLEAR_SUCCESS':
      return {
        ...state,
        [action.feature]: {
          ...featureState,
          successMessage: null,
        },
      };
    case 'SET_PENDING_DELETE':
      return {
        ...state,
        [action.feature]: {
          ...featureState,
          pendingDeleteId: action.id,
          pendingDeleteLabel: action.label,
        },
      };
    case 'RESET_DELETE_STATE':
      return {
        ...state,
        [action.feature]: {
          ...featureState,
          deletingId: null,
          pendingDeleteId: null,
          pendingDeleteLabel: null,
        },
      };
    default:
      return state;
  }
};

const MasterDataContext = createContext<MasterDataContextValue | undefined>(undefined);

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <MasterDataContext.Provider value={value}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterDataStore = (feature: MasterFeatureKey) => {
  const context = useContext(MasterDataContext);

  if (!context) {
    throw new Error('useMasterDataStore must be used within MasterDataProvider');
  }

  return {
    featureState: context.state[feature],
    dispatch: context.dispatch,
  };
};

export type { MasterFeatureKey };
