import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload as UploadIcon, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import UploadCard from '../components/UploadCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { uploadPCAP, analyzePCAP } from '../utils/api'

export default function Upload({ setAnalysisData }) {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setError(null)
    setUploadSuccess(false)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const uploadResult = await uploadPCAP(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadSuccess(true)
      setUploading(false)

      setTimeout(() => handleAnalyze(uploadResult.filename), 1000)

    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleAnalyze = async (filename) => {
    setAnalyzing(true)
    setError(null)

    try {
      const result = await analyzePCAP(filename)
      setAnalysisData(result)
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)

    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Upload PCAP File
            </h1>
            <p className="text-gray-400 text-lg">
              Upload your packet capture file to begin intelligent traffic analysis
            </p>
          </div>

          <UploadCard
            onFileSelect={handleFileSelect}
            disabled={uploading || analyzing}
          />

          {file && !analyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 mt-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="font-semibold text-white">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {uploadSuccess && (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}
              </div>

              {uploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Uploading...</span>
                    <span className="text-cyan-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="cyber-gradient h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {!uploading && !uploadSuccess && (
                <button
                  onClick={handleUpload}
                  className="btn-primary w-full mt-4"
                >
                  <UploadIcon className="w-5 h-5 inline mr-2" />
                  Start Upload & Analysis
                </button>
              )}
            </motion.div>
          )}

          {analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-8 mt-6 text-center"
            >
              <LoadingSpinner size="large" />
              <h3 className="text-xl font-semibold mt-6 mb-2">Analyzing PCAP File</h3>
              <p className="text-gray-400">
                Running ML models and threat detection modules...
              </p>
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                <p>✓ Parsing packets</p>
                <p>✓ Reconstructing flows</p>
                <p className="text-cyan-400">→ Extracting features</p>
                <p>○ Running detections</p>
                <p>○ Calculating risk scores</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 mt-6 border-red-500/50"
            >
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              { title: 'Supported Formats', desc: '.pcap, .pcapng' },
              { title: 'Max File Size', desc: '500 MB' },
              { title: 'Privacy', desc: 'Metadata only' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
