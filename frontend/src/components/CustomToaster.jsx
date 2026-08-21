import React from 'react';
import { Toaster as Sonner } from 'sonner';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CustomToaster() {
  const { theme, isDark } = useTheme();

  return (
    <Sonner
      position="bottom-right"
      theme={theme || (isDark ? 'dark' : 'light')}
      richColors={false}
      closeButton
      expand={true}
      duration={3000}
      icons={{
        success: <CheckCircle2 className="text-emerald-500 dark:text-emerald-400 w-5 h-5 flex-shrink-0" />,
        error: <AlertCircle className="text-rose-500 dark:text-rose-400 w-5 h-5 flex-shrink-0" />,
        warning: <AlertTriangle className="text-amber-500 dark:text-amber-400 w-5 h-5 flex-shrink-0" />,
        info: <Info className="text-blue-500 dark:text-blue-400 w-5 h-5 flex-shrink-0" />,
        loading: <Loader2 className="text-[#00478d] dark:text-blue-400 w-5 h-5 animate-spin flex-shrink-0" />,
      }}
      toastOptions={{
        style: {
          borderRadius: '14px',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '13.5px',
          fontWeight: '500',
          padding: '14px 18px',
          letterSpacing: '-0.01em',
          background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          color: isDark ? '#f8fafc' : '#0f172a',
          border: isDark ? '1px solid rgba(51, 65, 85, 0.8)' : '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: isDark
            ? '0 12px 30px -4px rgba(0, 0, 0, 0.5), 0 4px 12px -2px rgba(0, 0, 0, 0.4)'
            : '0 12px 30px -4px rgba(0, 71, 141, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(12px)',
        },
        className: 'medtrust-toast',
      }}
    />
  );
}
