import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Activity, AlertTriangle, Upload, Zap, Network, BarChart3 } from 'lucide-react';

const capabilities = [
  {
    icon: Upload,
    title: 'Upload PCAP',
    description: 'Drag & drop .pcap or .pcapng files for instant analysis',
  },
  {
    icon: Activity,
    title: 'Behavioral Detection',
    description: 'ML-augmented pattern recognition for encrypted traffic',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Scoring',
    description: 'Comprehensive 0-100 scoring with severity classification',
  },
  {
    icon: Network,
    title: 'Flow Reconstruction',
    description: 'Intelligent session reassembly and flow extraction',
  },
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Fast processing with parallel feature extraction',
  },
  {
    icon: BarChart3,
    title: 'Visual Reports',
    description: 'Interactive dashboards and exportable JSON reports',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2"
            >
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Network Security Analysis</span>
            </motion.div>

            <h1 className="mb-4 font-mono text-5xl font-bold tracking-tight md:text-7xl">
              <span className="text-foreground">Net</span>
              <span className="text-gradient">ScapeX</span>
            </h1>
            
            <p className="mb-6 font-mono text-2xl font-semibold text-primary md:text-3xl">
              Beyond Packet Inspection
            </p>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              PCAP-based network traffic analysis with metadata-only inspection, 
              intelligent flow reconstruction, and ML-augmented threat detection. 
              Identify anomalies, score risks, and protect your network.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/upload">
                <Button variant="hero" size="lg" className="gap-2">
                  <Upload className="h-5 w-5" />
                  Start Analysis
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="heroOutline" size="lg" className="gap-2">
                  <BarChart3 className="h-5 w-5" />
                  View Demo Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Animated Background Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
          />
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 font-mono text-3xl font-bold md:text-4xl">
              <span className="text-gradient">Key Capabilities</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Comprehensive network analysis powered by advanced algorithms and machine learning
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <capability.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-mono text-lg font-semibold">{capability.title}</h3>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative border-t border-border/50 bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 font-mono text-3xl font-bold md:text-4xl">
              How It <span className="text-gradient">Works</span>
            </h2>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Upload', description: 'Drop your PCAP file for analysis' },
              { step: '02', title: 'Analyze', description: 'ML-powered flow reconstruction and detection' },
              { step: '03', title: 'Review', description: 'Interactive dashboard with risk scoring' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-mono text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mb-2 font-mono text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < 2 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-primary/50 to-transparent md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center md:p-12"
          >
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="relative z-10">
              <Shield className="mx-auto mb-6 h-12 w-12 text-primary" />
              <h2 className="mb-4 font-mono text-3xl font-bold md:text-4xl">
                Ready to Secure Your Network?
              </h2>
              <p className="mb-8 text-muted-foreground">
                Upload your first PCAP file and discover hidden threats in your network traffic.
              </p>
              <Link to="/upload">
                <Button variant="hero" size="lg" className="gap-2">
                  <Upload className="h-5 w-5" />
                  Upload PCAP Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
