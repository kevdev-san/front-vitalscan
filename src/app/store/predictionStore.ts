import { create } from 'zustand';

// ── Types ──────────────────────────────────────────────

export interface FormData {
  age:           number;
  bmi:           number;
  HbA1c_level:   number;
  hypertension:  0 | 1;
  heart_disease: 0 | 1;
}

// Matches exactly what POST /api/predict returns
export interface ApiResult {
  prediction:          0 | 1;   // 0 = no diabetes, 1 = diabetes
  label:               string;  // "diabetes" | "no diabetes"
  probability: number;  // 82.7
}

interface PredictionStore {
  form:      FormData;
  result:    ApiResult | null;
  setForm:   (data: Partial<FormData>) => void;
  setResult: (result: ApiResult) => void;
  reset:     () => void;
}

// ── Defaults ───────────────────────────────────────────

const defaultForm: FormData = {
  age:           35,
  bmi:           24.0,
  HbA1c_level:   5.5,
  hypertension:  0,
  heart_disease: 0,
};

// ── Store ──────────────────────────────────────────────

export const usePredictionStore = create<PredictionStore>((set) => ({
  form:      defaultForm,
  result:    null,
  setForm:   (data) => set((state) => ({ form: { ...state.form, ...data } })),
  setResult: (result) => set({ result }),
  reset:     () => set({ form: defaultForm, result: null }),
}));