import React, { createContext, useContext, useState } from 'react';

const PromptContext = createContext(null);

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
};

export const PromptProvider = ({ children }) => {
  const [promptConfig, setPromptConfig] = useState(null);

  const showPrompt = ({
    type = 'alert',
    title = '',
    message = '',
    onConfirm = null,
    confirmText = '',
    cancelText = 'Cancel',
  }) => {
    // Determine defaults based on type
    let defaultTitle = title;
    let defaultConfirmText = confirmText;

    if (!title) {
      if (type === 'confirm') defaultTitle = 'Confirm Action';
      else if (type === 'success') defaultTitle = 'Success';
      else if (type === 'error') defaultTitle = 'Error occurred';
      else defaultTitle = 'Notification';
    }

    if (!confirmText) {
      if (type === 'confirm') defaultConfirmText = 'Confirm';
      else defaultConfirmText = 'OK';
    }

    setPromptConfig({
      type,
      title: defaultTitle,
      message,
      onConfirm,
      confirmText: defaultConfirmText,
      cancelText,
    });
  };

  const handleConfirm = () => {
    if (promptConfig?.onConfirm) {
      promptConfig.onConfirm();
    }
    setPromptConfig(null);
  };

  const handleCancel = () => {
    setPromptConfig(null);
  };

  return (
    <PromptContext.Provider value={{ showPrompt }}>
      {children}
      {promptConfig && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-charcoal/30 backdrop-blur-[4px] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              {/* Icon Container */}
              <div className={`mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-4 ${
                promptConfig.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                promptConfig.type === 'error' ? 'bg-rose-50 text-rose-600' :
                'bg-rgukt-maroon/5 text-rgukt-maroon'
              }`}>
                {promptConfig.type === 'confirm' && <span className="text-2xl">⚠️</span>}
                {promptConfig.type === 'success' && <span className="text-2xl">✨</span>}
                {promptConfig.type === 'error' && <span className="text-2xl">❌</span>}
                {promptConfig.type === 'alert' && <span className="text-2xl">ℹ️</span>}
              </div>

              <h3 className="text-lg font-bold text-charcoal mb-2 font-display">
                {promptConfig.title}
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {promptConfig.message}
              </p>
            </div>
            <div className="flex gap-3">
              {promptConfig.type === 'confirm' && (
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer outline-none"
                >
                  {promptConfig.cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`flex-1 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-center outline-none ${
                  promptConfig.type === 'error' ? 'bg-rose-600 hover:bg-rose-700' :
                  promptConfig.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  'bg-rgukt-maroon hover:opacity-95'
                }`}
              >
                {promptConfig.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </PromptContext.Provider>
  );
};
