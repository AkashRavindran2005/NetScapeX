import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult, UploadProgress } from '@/types/analysis';

interface AnalysisContextType {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  uploadProgress: UploadProgress;
  setUploadProgress: (progress: UploadProgress) => void;
  resetAnalysis: () => void;
}

const initialUploadProgress: UploadProgress = {
  state: 'idle',
  progress: 0,
  message: '',
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>(initialUploadProgress);

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setUploadProgress(initialUploadProgress);
  };

  return (
    <AnalysisContext.Provider
      value={{
        analysisResult,
        setAnalysisResult,
        uploadProgress,
        setUploadProgress,
        resetAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
