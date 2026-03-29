'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Gaugechart from '@/app/components/Gaugechart';
import { usePredictionStore } from '@/app/store/predictionStore';

// ── Helpers derived from API response ─────────────────
function getRiskMeta(probability: number, prediction: 0 | 1) {
  // Use probability_percent to drive color/label
  if (prediction === 0) {
    if (probability < 25) return { color: '#16a34a', bgClass: 'bg-green-50', displayLabel: 'Bajo Riesgo' };
    return { color: '#d97706', bgClass: 'bg-yellow-50', displayLabel: 'Riesgo Moderado' };
  }
  if (probability < 75) return { color: '#ea580c', bgClass: 'bg-orange-50', displayLabel: 'Riesgo Alto' };
  return { color: '#dc2626', bgClass: 'bg-red-50', displayLabel: 'Riesgo Muy Alto' };
}

function getRecommendation(probability: number, prediction: 0 | 1) {
  if (prediction === 0 && probability < 25) return {
    icon: 'thumb_up', cls: 'bg-green-50 border-green-100 text-green-800',
    title: 'Perfil saludable',
    text: 'Mantén tus hábitos actuales. Se recomienda una revisión anual de rutina.',
  };
  if (prediction === 0) return {
    icon: 'medical_information', cls: 'bg-yellow-50 border-yellow-100 text-yellow-800',
    title: 'Atención preventiva',
    text: 'Considera ajustar dieta y actividad física. Consulta a tu médico en los próximos meses.',
  };
  if (probability < 75) return {
    icon: 'warning', cls: 'bg-orange-50 border-orange-100 text-orange-800',
    title: 'Consulta recomendada',
    text: 'Riesgo elevado detectado. Se recomienda una consulta médica pronto para evaluación completa.',
  };
  return {
    icon: 'emergency', cls: 'bg-red-50 border-red-100 text-red-800',
    title: 'Consulta urgente',
    text: 'Riesgo muy alto. Busca atención médica a la brevedad para un diagnóstico formal.',
  };
}

function buildFactors(form: ReturnType<typeof usePredictionStore.getState>['form']) {
  const factors: { icon: string; colorClass: string; text: string }[] = [];

  if (form.HbA1c_level >= 6.5)
    factors.push({ icon: 'error', colorClass: 'text-red-500', text: `HbA1c ${form.HbA1c_level}% — rango diabético` });
  else if (form.HbA1c_level >= 5.7)
    factors.push({ icon: 'warning', colorClass: 'text-yellow-600', text: `HbA1c ${form.HbA1c_level}% — prediabetes` });

  if (form.bmi >= 30)
    factors.push({ icon: 'warning', colorClass: 'text-orange-500', text: `IMC ${form.bmi} — obesidad` });
  else if (form.bmi >= 25)
    factors.push({ icon: 'info', colorClass: 'text-yellow-600', text: `IMC ${form.bmi} — sobrepeso` });

  if (form.age >= 45)
    factors.push({ icon: 'info', colorClass: 'text-blue-500', text: `Edad ${form.age} — factor de riesgo` });

  if (form.hypertension)
    factors.push({ icon: 'favorite', colorClass: 'text-red-400', text: 'Hipertensión presente' });

  if (form.heart_disease)
    factors.push({ icon: 'cardiology', colorClass: 'text-orange-400', text: 'Enfermedad cardíaca presente' });

  if (!factors.length)
    factors.push({ icon: 'check_circle', colorClass: 'text-green-500', text: 'Sin factores de alto riesgo detectados' });

  return factors;
}

// ── Page ───────────────────────────────────────────────
export default function ResultsPage() {
  const router = useRouter();
  const { result, form, reset } = usePredictionStore();

  // Guard: if user lands here directly without data
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-slate-300 text-[64px] mb-4">assignment_late</span>
        <p className="text-slate-500 text-sm mb-6">
          No hay datos de evaluación. Por favor completa el formulario primero.
        </p>
        <Link
          href="/prediction"
          className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-2xl shadow-md shadow-primary/25 hover:bg-primary-dark transition-all"
        >
          Ir al formulario
        </Link>
      </div>
    );
  }

  const { prediction, label, probability } = result;
  const { color, bgClass, displayLabel } = getRiskMeta(probability, prediction);
  const rec = getRecommendation(probability, prediction);
  const factors = buildFactors(form);

  console.log('result completo:', result);
  console.log('probability:', probability);
  console.log('tipo:', typeof probability);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

      {/* ── Main result card ── */}
      <div className="lg:col-span-2 space-y-6">

        {/* Gauge + badge + factors */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">assessment</span>
            <h3 className="text-lg font-bold text-slate-800">Resultado del Análisis</h3>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* Gauge — driven by probability from API */}
            <div className="shrink-0">
              <Gaugechart risk={probability} color={color} />
            </div>

            <div className="flex-1 w-full">
              {/* API label + probability */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl ${bgClass} mb-1`}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-sm font-bold capitalize" style={{ color }}>{displayLabel}</span>
              </div>
              <p className="text-sm text-slate-400 mb-4 ml-1">
                Clasificación del modelo: <strong className="text-slate-600 capitalize">{label}</strong>
                {' · '}Probabilidad: <strong className="text-slate-600">{probability}%</strong>
              </p>

              {/* Factors */}
              <div className="space-y-2 text-xs text-slate-500">
                {factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">
                    <span className={`material-symbols-outlined text-[15px] ${f.colorClass}`}>{f.icon}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`rounded-3xl border p-6 ${rec.cls}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">{rec.icon}</span>
            </div>
            <div>
              <p className="text-sm font-bold mb-1">{rec.title}</p>
              <p className="text-xs leading-relaxed opacity-80">{rec.text}</p>
            </div>
          </div>
        </div>

        {/* Summary of form values */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">summarize</span>
            Indicadores ingresados
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Edad', value: `${form.age} años`, icon: 'person' },
              { label: 'IMC', value: form.bmi.toFixed(1), icon: 'monitor_weight' },
              { label: 'HbA1c', value: `${form.HbA1c_level.toFixed(1)}%`, icon: 'water_drop' },
              { label: 'Hipertensión', value: form.hypertension ? 'Sí' : 'No', icon: 'favorite' },
              { label: 'Enf. Cardíaca', value: form.heart_disease ? 'Sí' : 'No', icon: 'cardiology' },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                  <p className="text-sm font-extrabold text-slate-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Sidebar ── */}
      <div className="space-y-4">

        {/* Actions */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-3">
          <h4 className="text-sm font-bold text-slate-800 mb-1">Acciones</h4>
          <button
            onClick={() => { reset(); router.push('/prediction'); }}
            className="w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-2xl shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Nueva Evaluación
          </button>
          <button
            onClick={() => window.print()}
            className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Imprimir Resultado
          </button>
        </div>

        {/* Disclaimer */}
        <div className="bg-primary-light rounded-3xl border border-primary/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">shield_person</span>
            </div>
            <h3 className="text-sm font-bold text-primary">Uso informativo</h3>
          </div>
          <p className="text-xs text-primary/70 leading-relaxed">
            Este resultado es de carácter preventivo. No reemplaza el diagnóstico médico profesional.
          </p>
        </div>

        {/* Risk legend */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">info</span>
            </div>
            <h3 className="text-sm font-bold text-slate-800">¿Qué significa el riesgo?</h3>
          </div>
          <div className="space-y-2 text-[11px] text-slate-500">
            {[
              { range: '0 – 24%', label: 'Bajo', color: 'bg-green-400' },
              { range: '25 – 49%', label: 'Moderado', color: 'bg-yellow-400' },
              { range: '50 – 74%', label: 'Alto', color: 'bg-orange-400' },
              { range: '75 – 100%', label: 'Muy Alto', color: 'bg-red-400' },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${r.color}`} />
                <span><strong>{r.range}</strong> — {r.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}