'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePredictionStore } from '@/app/store/predictionStore';

// ── Helpers ────────────────────────────────────────────
function getBmiTag(val: number) {
  if (val < 18.5) return { cls: 'bg-blue-100 text-blue-700', icon: 'arrow_downward', text: 'Bajo peso' };
  if (val < 25) return { cls: 'bg-green-100 text-green-700', icon: 'check_circle', text: 'Normal' };
  if (val < 30) return { cls: 'bg-yellow-100 text-yellow-700', icon: 'warning', text: 'Sobrepeso' };
  return { cls: 'bg-red-100 text-red-700', icon: 'error', text: 'Obesidad' };
}



// ── Toggle ─────────────────────────────────────────────
function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={e => { e.stopPropagation(); onToggle(); }}
      className="relative w-11 h-6 shrink-0 focus:outline-none"
      aria-pressed={active}
    >
      <div className={`w-full h-full rounded-full transition-colors duration-200 ${active ? 'bg-primary' : 'bg-slate-300'}`} />
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

// ── Page ───────────────────────────────────────────────
export default function PredictionPage() {
  const router = useRouter();
  const { form, setForm, setResult } = usePredictionStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bmiTag = getBmiTag(form.bmi);


  const handleRange = (field: keyof typeof form, value: number) =>
    setForm({ [field]: value });

  const handleToggle = (field: 'hypertension' | 'heart_disease') =>
    setForm({ [field]: form[field] === 0 ? 1 : 0 });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: form.age,
          hypertension: form.hypertension,
          heart_disease: form.heart_disease,
          bmi: form.bmi,
          HbA1c_level: form.HbA1c_level,
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      // { prediction: 1, label: "diabetes", probability_percent: 82.7 }
      const data = await res.json();

      setResult({
        prediction: data.prediction,
        label: data.label,
        probability: data.probability,
      });

      router.push('/prediction/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

      {/* ── Form Panel ── */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">assignment</span>
            Indicadores Clínicos
          </h2>

          <div className="space-y-6">

            {/* Age */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                  Edad
                </label>
                <span className="text-lg font-extrabold text-primary tabular-nums">{form.age}</span>
              </div>
              <input type="range" min={1} max={100} value={form.age}
                onChange={e => handleRange('age', Number(e.target.value))}
                className="w-full" />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>1 año</span><span>100 años</span>
              </div>
              <input type="number" min={1} max={100} value={form.age}
                onChange={e => handleRange('age', Number(e.target.value))}
                className="mt-3 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition" />
              <p className="text-[11px] text-slate-400 mt-1">Años cumplidos del paciente.</p>
            </div>

            {/* BMI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="material-symbols-outlined text-[18px] text-primary">monitor_weight</span>
                  IMC <span className="font-normal text-slate-400 text-xs ml-1">(Índice de Masa Corporal)</span>
                </label>
                <span className="text-lg font-extrabold text-primary tabular-nums">{form.bmi.toFixed(1)}</span>
              </div>
              <input type="range" min={10} max={60} step={0.1} value={form.bmi}
                onChange={e => handleRange('bmi', parseFloat(e.target.value))}
                className="w-full" />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>10</span><span>60</span>
              </div>
              <input type="number" min={10} max={60} step={0.1} value={form.bmi}
                onChange={e => handleRange('bmi', parseFloat(e.target.value))}
                className="mt-3 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition" />
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${bmiTag.cls}`}>
                  <span className="material-symbols-outlined text-[13px]">{bmiTag.icon}</span>
                  {bmiTag.text}
                </span>
                <span className="text-[11px] text-slate-400">Bajo: &lt;18.5 · Normal: 18.5–24.9 · Sobrepeso: 25–29.9 · Obesidad: ≥30</span>
              </div>
            </div>

            {/* HbA1c */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="material-symbols-outlined text-[18px] text-primary">water_drop</span>
                  Nivel HbA1c <span className="font-normal text-slate-400 text-xs ml-1">(Hemoglobina Glicosilada)</span>
                </label>
                <span className="text-lg font-extrabold text-primary tabular-nums">{form.HbA1c_level.toFixed(1)}</span>
              </div>
              <input type="range" min={3} max={15} step={0.1} value={form.HbA1c_level}
                onChange={e => handleRange('HbA1c_level', parseFloat(e.target.value))}
                className="w-full" />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>3.0%</span><span>15.0%</span>
              </div>
              <input type="number" min={3} max={15} step={0.1} value={form.HbA1c_level}
                onChange={e => handleRange('HbA1c_level', parseFloat(e.target.value))}
                className="mt-3 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition" />
              <div className="flex items-center gap-2 mt-2">


              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-primary/30 transition cursor-pointer select-none"
                onClick={() => handleToggle('hypertension')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-red-400 text-[20px]">favorite</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Hipertensión</span>
                  </div>
                  <Toggle active={form.hypertension === 1} onToggle={() => handleToggle('hypertension')} />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">¿El paciente tiene diagnóstico de presión arterial alta?</p>
                <p className={`mt-2 text-xs font-bold ${form.hypertension ? 'text-primary' : 'text-slate-400'}`}>
                  {form.hypertension ? 'Sí' : 'No'}
                </p>
              </div>

              <div
                className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-primary/30 transition cursor-pointer select-none"
                onClick={() => handleToggle('heart_disease')}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-orange-400 text-[20px]">cardiology</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Enfermedad Cardíaca</span>
                  </div>
                  <Toggle active={form.heart_disease === 1} onToggle={() => handleToggle('heart_disease')} />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">¿El paciente tiene diagnóstico de enfermedad cardiovascular?</p>
                <p className={`mt-2 text-xs font-bold ${form.heart_disease ? 'text-primary' : 'text-slate-400'}`}>
                  {form.heart_disease ? 'Sí' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-8 py-4 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white text-base font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Analizando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">analytics</span>
                  Analizar Riesgo
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-3">
              <span className="material-symbols-outlined text-[13px] align-middle">lock</span>
              {' '}Tus datos no se almacenan. Solo uso diagnóstico informativo.
            </p>
          </div>

        </div>
      </div>

      {/* ── Sidebar ── */}
      <div className="space-y-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">info</span>
            </div>
            <h3 className="text-sm font-bold text-slate-800">¿Qué es el HbA1c?</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            La hemoglobina glicosilada refleja el nivel promedio de glucosa en sangre de los últimos 2–3 meses. Es el indicador más confiable para el diagnóstico de diabetes.
          </p>
        </div>

        <div className="bg-primary-light rounded-3xl border border-primary/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">shield_person</span>
            </div>
            <h3 className="text-sm font-bold text-primary">Uso informativo</h3>
          </div>
          <p className="text-xs text-primary/70 leading-relaxed">
            Esta herramienta es de carácter preventivo e informativo. No reemplaza el diagnóstico médico profesional.
          </p>
        </div>
      </div>

    </div>
  );
}