'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function PredictionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isResult = pathname.includes('/results');

  return (
    <section
      className="min-h-screen pt-24 pb-16"
      style={{ background: 'radial-gradient(circle at top right, #eff6ff 0%, transparent 60%), #fcfdfe' }}
    >
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Page header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold text-primary bg-primary-light rounded-full border border-primary/10 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">biotech</span>
            Evaluación Clínica
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3">
            Análisis de <span className="text-primary">Riesgo Diabético</span>
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Ingresa tus indicadores clínicos y nuestro modelo de IA calculará tu perfil de riesgo en segundos.
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-500 ${!isResult ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-primary/30 text-primary'}`}>
              1
            </div>
            <span className={`text-xs font-semibold hidden sm:block transition-colors duration-500 ${!isResult ? 'text-primary' : 'text-slate-400'}`}>
              Datos
            </span>
          </div>

          <div className={`w-10 h-0.5 transition-colors duration-500 ${isResult ? 'bg-primary' : 'bg-slate-200'}`} />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-500 ${isResult ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-slate-200 text-slate-400'}`}>
              2
            </div>
            <span className={`text-xs font-semibold hidden sm:block transition-colors duration-500 ${isResult ? 'text-primary' : 'text-slate-400'}`}>
              Resultado
            </span>
          </div>
        </div>

        {/* Page content */}
        {children}

      </div>
    </section>
  );
}