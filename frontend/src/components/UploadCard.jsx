import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UploadCard({ onFileSelect, disabled }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.tcpdump.pcap': ['.pcap'],
      'application/x-pcapng': ['.pcapng']
    },
    maxFiles: 1,
    disabled
  })

  return (
    <motion.div
      {...getRootProps()}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      className={`glass-card p-12 border-2 border-dashed ${
        isDragActive ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-cyan-400/50'} transition-all`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-400/20 mb-6">
          {isDragActive ? (
            <FileText className="w-10 h-10 text-cyan-400" />
          ) : (
            <Upload className="w-10 h-10 text-cyan-400" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-white">
          {isDragActive ? 'Drop your PCAP file here' : 'Drag & drop PCAP file'}
        </h3>
        
        <p className="text-gray-400 mb-4">
          or click to browse your computer
        </p>
        
        <p className="text-sm text-gray-500">
          Supported formats: .pcap, .pcapng (Max 500MB)
        </p>
      </div>
    </motion.div>
  )
}
