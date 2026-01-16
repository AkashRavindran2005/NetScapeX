import { motion } from "framer-motion";

const logos = [
  { name: "Vercel", width: "w-24" },
  { name: "Stripe", width: "w-20" },
  { name: "Figma", width: "w-16" },
  { name: "Linear", width: "w-20" },
  { name: "Notion", width: "w-24" },
  { name: "Slack", width: "w-20" },
];

export const TrustedBy = () => {
  return (
    <section className="py-16 border-y border-border/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-8">
            Trusted by developers at
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            {logos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${logo.width} h-8 flex items-center justify-center`}
              >
                <span className="text-foreground font-semibold text-xl tracking-tight">
                  {logo.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
