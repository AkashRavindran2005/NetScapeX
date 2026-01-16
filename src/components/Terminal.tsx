import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const commands = [
  { prompt: "$ phase init", delay: 0 },
  { output: "✓ Initialized Phase in ./phase.yaml", delay: 500 },
  { prompt: "$ phase secrets set API_KEY", delay: 1200 },
  { output: "Enter secret value: ••••••••••••••••", delay: 1800 },
  { output: "✓ Secret 'API_KEY' saved", delay: 2400 },
  { prompt: "$ phase run -- node server.js", delay: 3200 },
  { output: "✓ Injecting 12 secrets...", delay: 3800 },
  { output: "🚀 Server running on port 3000", delay: 4400 },
];

export const Terminal = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < commands.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, commands[visibleLines].delay + 600);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Terminal Window */}
          <div className="rounded-xl overflow-hidden terminal-glow">
            {/* Terminal Header */}
            <div className="bg-secondary/80 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-muted-foreground text-sm font-mono ml-4">
                ~/my-project
              </span>
            </div>

            {/* Terminal Body */}
            <div className="bg-card p-6 font-mono text-sm min-h-[300px]">
              {commands.slice(0, visibleLines).map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2"
                >
                  {line.prompt ? (
                    <span className="text-primary">{line.prompt}</span>
                  ) : (
                    <span className="text-muted-foreground">{line.output}</span>
                  )}
                </motion.div>
              ))}
              {visibleLines < commands.length && (
                <span className="inline-block w-2 h-5 bg-primary animate-blink" />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
