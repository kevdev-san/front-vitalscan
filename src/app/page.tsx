// app/page.tsx
'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function HomePage() {

  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!typedRef.current) return;

    const typed = new Typed(typedRef.current, {
      strings: [
        'bajo control.',
        'en buenas manos.',
        'protegida.',
        'analizada.',
      ],
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 1800,
      loop: true,
      smartBackspace: true,
    });

    return () => typed.destroy();
  }, []);

  return (
    <section className="relative min-h-screen items-center overflow-hidden px-6 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
      {/* Content Column */}
      <div className="z-10">
        <div className="w-full flex justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold text-primary bg-primary-light rounded-full border border-primary/10 uppercase tracking-wider">
            IA Médica Preventiva
          </div>
        </div>

        <h1 className="text-5xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-6 text-center lg:text-left">
          Tu salud, <br />
          <span className="text-primary">
            <span ref={typedRef} />
          </span>
        </h1>

        <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed text-center lg:text-left">
          Analizamos tus indicadores para la{' '}
          <span className="font-bold text-slate-800 underline decoration-primary/30">
            predicción de riesgo de diabetes
          </span>{' '}
          con precisión clínica inmediata.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/prediction"
            className="px-10 py-5 text-white text-lg font-bold rounded-custom shadow-xl shadow-primary/25 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark"
          >
            Comenzar Evaluación
          </Link>
        </div>
      </div>

      {/* Image Column */}
      <div className="relative z-10 hidden lg:block">
        <div className="relative w-full max-w-lg ml-auto pr-10 pb-6">
          <div className="relative rounded-4xl overflow-hidden shadow-2xl border-12 border-white">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt3TJNURQftk7B3ZUJtjrmRiHZi73sXMkGvU_tzlz3nLjamJZQaIUrT5n6y9VY0ipOz5HHEGV0RkG_MzNSq8SX65iwi3uU0sgEyiwBsZEdaZCArLD66abcxaZHxsSOcUhtH26oflP8bmJdxM6LkvAVGr9E5UqvO6-0j_MHoXHASU8_UEYNHNvvRDs6loTgX27AnFxTcAOHPKCGzkBVm1I7IfD3sZe4QZ0TwUXBAMyn-2DqjuDbfJlIYs9UisQ5wEOLbkjicQ1Gphk"
              alt="VitalScan Plataforma Médica"
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
          </div>

          <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4">
            <div className="p-3 bg-primary-light text-primary rounded-xl">
              <span className="material-symbols-outlined">monitoring</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Precisión</p>
              <p className="text-lg font-extrabold text-slate-800">98.2%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}