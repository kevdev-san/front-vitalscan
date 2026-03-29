// app/layout.tsx
import Link from 'next/link';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'VitalScan - Predicción de Riesgo de Diabetes',
  description: 'Analizamos tus indicadores para la predicción de riesgo de diabetes con precisión clínica inmediata.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-clinical-gray bg-clinical-white">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">VitalScan</span>
            </div>
            <div className="flex items-center space-x-8 text-sm font-semibold">
              <Link className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span>Inicio</span>
              </Link>
              <Link className="text-slate-600 hover:text-primary transition-colors" href="/prediction">
                <span>Predicción</span>
              </Link>
            </div>
          </nav>
        </header>

        {/* Main content */}
        <main className="pt-2">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 py-12 mt-16">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

            <p className="text-sm text-slate-400">
              © 2025 VitalScan. Diagnóstico informativo preventivo.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}