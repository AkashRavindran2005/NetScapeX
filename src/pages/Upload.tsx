import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileUp, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { generateMockAnalysis } from '@/data/mockAnalysis';
import { UploadState } from '@/types/analysis';

const uploadStages: { state: UploadState; message: string }[] = [
  { state: 'uploading', message: 'Uploading file...' },
  { state: 'parsing', message: 'Parsing PCAP structure...' },
  { state: 'reconstructing', message: 'Reconstructing network flows...' },
  { state: 'extracting', message: 'Extracting flow features...' },
  { state: 'detecting', message: 'Running ML detection models...' },
  { state: 'scoring', message: 'Calculating risk scores...' },
];

const UploadPage = () => {
  const navigate = useNavigate();
  const { setAnalysisResult, setUploadProgress, uploadProgress } = useAnalysis();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.pcap', '.pcapng'];
    const fileName = file.name.toLowerCase();
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidExtension) {
      setError('Unsupported file type. Please upload a .pcap or .pcapng file.');
      return false;
    }

    if (file.size === 0) {
      setError('File is empty or unreadable.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  }, []);

  const simulateAnalysis = async () => {
    for (let i = 0; i < uploadStages.length; i++) {
      const stage = uploadStages[i];
      setUploadProgress({
        state: stage.state,
        progress: ((i + 1) / uploadStages.length) * 100,
        message: stage.message,
      });
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    // Generate mock analysis result
    const result = generateMockAnalysis(selectedFile?.name || 'capture.pcap');
    setAnalysisResult(result);
    
    setUploadProgress({
      state: 'complete',
      progress: 100,
      message: 'Analysis complete!',
    });

    // Navigate to dashboard after a brief delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  const handleStartAnalysis = () => {
    if (!selectedFile) return;
    simulateAnalysis();
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
    setUploadProgress({ state: 'idle', progress: 0, message: '' });
  };

  const isProcessing = uploadProgress.state !== 'idle' && uploadProgress.state !== 'complete' && uploadProgress.state !== 'error';

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="mb-2 font-mono text-3xl font-bold md:text-4xl">
            Upload <span className="text-gradient">PCAP</span>
          </h1>
          <p className="mb-8 text-muted-foreground">
            Drop your packet capture file to begin analysis
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all ${
              isDragging
                ? 'border-primary bg-primary/10'
                : selectedFile
                ? 'border-primary/50 bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input
              type="file"
              accept=".pcap,.pcapng"
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={isProcessing}
            />
            
            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-4 rounded-full bg-primary/20 p-4">
                    <FileUp className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mb-1 font-mono font-semibold">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {!isProcessing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearFile();
                      }}
                      className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                      Remove file
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="no-file"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <UploadIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mb-1 font-semibold">Drag & drop your PCAP file</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Supported formats: .pcap, .pcapng
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing Progress */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-6 rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="font-mono text-sm">{uploadProgress.message}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="mt-4 grid grid-cols-6 gap-1">
                {uploadStages.map((stage, index) => {
                  const stageIndex = uploadStages.findIndex(s => s.state === uploadProgress.state);
                  const isComplete = index < stageIndex;
                  const isCurrent = index === stageIndex;
                  
                  return (
                    <div
                      key={stage.state}
                      className={`h-1 rounded-full transition-colors ${
                        isComplete
                          ? 'bg-primary'
                          : isCurrent
                          ? 'bg-primary/50'
                          : 'bg-muted'
                      }`}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Analysis Button */}
        {selectedFile && !isProcessing && uploadProgress.state !== 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Button
              variant="hero"
              size="lg"
              className="w-full gap-2"
              onClick={handleStartAnalysis}
            >
              <CheckCircle2 className="h-5 w-5" />
              Start Analysis
            </Button>
          </motion.div>
        )}

        {/* Success State */}
        <AnimatePresence>
          {uploadProgress.state === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center rounded-xl border border-primary/50 bg-primary/10 p-8 text-center"
            >
              <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-mono text-xl font-semibold">Analysis Complete!</h3>
              <p className="text-muted-foreground">Redirecting to dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadPage;
