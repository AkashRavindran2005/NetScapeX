import { motion } from "framer-motion";
import { 
  Shield, 
  Zap, 
  GitBranch, 
  Lock, 
  Cloud, 
  Terminal as TerminalIcon,
  Users,
  RefreshCw
} from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "Your secrets are encrypted client-side before leaving your machine. We can never see your data.",
  },
  {
    icon: GitBranch,
    title: "Environment Branching",
    description: "Manage secrets across development, staging, and production with ease.",
  },
  {
    icon: Zap,
    title: "Instant Sync",
    description: "Changes propagate instantly across your infrastructure with real-time updates.",
  },
  {
    icon: Cloud,
    title: "Self-Host or Cloud",
    description: "Deploy on your own infrastructure or use our managed cloud service.",
  },
  {
    icon: TerminalIcon,
    title: "CLI & SDKs",
    description: "First-class CLI experience with SDKs for Node.js, Python, Go, and more.",
  },
  {
    icon: Users,
    title: "Team Access Control",
    description: "Fine-grained permissions and audit logs for enterprise compliance.",
  },
  {
    icon: Shield,
    title: "SOC 2 Compliant",
    description: "Enterprise-grade security with SOC 2 Type II certification.",
  },
  {
    icon: RefreshCw,
    title: "Secret Rotation",
    description: "Automated secret rotation with zero-downtime deployments.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-radial-glow opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Everything you need for</span>
            <br />
            <span className="text-gradient">secure secret management</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built for developers who care about security and developer experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-6 rounded-xl glass hover:bg-card/80 transition-all duration-300 hover:border-primary/30"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
