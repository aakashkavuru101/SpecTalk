"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const VAGUE = "Make it load faster";

const SPEC_LINES = [
  "Implement lazy loading for above-the-fold images using",
  "the native loading='lazy' attribute. For route-level",
  "code splitting, use Next.js dynamic imports with a",
  "Suspense boundary and a skeleton fallback component.",
  "",
  "Scope: Medium · Est. 1–2 days",
];

const STEPS = [
  {
    number: "01",
    title: "You describe it",
    description: "Plain English. No jargon required.",
  },
  {
    number: "02",
    title: "SpecTalk translates",
    description: "Stack-aware AI maps your intent to real APIs.",
  },
  {
    number: "03",
    title: "Your AI tool acts",
    description: "Paste the spec. Claude Code, Cursor, v0 — they understand it.",
  },
];

function TypingText({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + i * 0.03, duration: 0 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

function InputCard({ inView }: { inView: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/50 bg-muted/30">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-2 text-[10px] text-muted-foreground/50 font-mono">
          spectalk.vercel.app
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-2">
          What do you want to build?
        </p>
        <p className="font-[family-name:var(--font-dm-sans)] text-sm text-foreground min-h-[1.5rem]">
          {inView && (
            <>
              <TypingText text={VAGUE} delay={0.2} />
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, repeatDelay: 0.1 }}
                className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
              />
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function OutputCard({ inView }: { inView: boolean }) {
  return (
    <div className="rounded-xl border border-indigo-500/30 bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-indigo-500/5">
        <span className="text-[10px] text-indigo-400/70 uppercase tracking-wider font-medium">
          Technical specification
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Medium · 1–2 days
        </span>
      </div>
      <div className="px-4 py-4 font-mono text-xs leading-relaxed text-foreground/80 min-h-[100px]">
        {inView &&
          SPEC_LINES.map((line, i) =>
            line === "" ? (
              <br key={i} />
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: VAGUE.length * 0.03 + 0.6 + i * 0.15,
                  duration: 0.25,
                  ease: "easeOut",
                }}
              >
                {line}
              </motion.div>
            )
          )}
      </div>
    </div>
  );
}

function ProcessingArrow({ inView }: { inView: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4 lg:py-0">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="relative flex items-center justify-center"
      >
        {/* Pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-indigo-500/30"
            animate={inView ? { scale: [1, 1.8], opacity: [0.4, 0] } : {}}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              delay: i * 0.6,
              ease: "easeOut",
            }}
            style={{ width: 40, height: 40 }}
          />
        ))}
        <div className="relative z-10 w-10 h-10 rounded-full bg-indigo-600/90 border border-indigo-400/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-[10px] font-[family-name:var(--font-sora)] font-bold text-white">
            ST
          </span>
        </div>
      </motion.div>

      {/* Arrow — horizontal on lg, vertical on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
        className="text-indigo-400/50 text-lg select-none hidden lg:block"
      >
        →
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
        className="text-indigo-400/50 text-lg select-none lg:hidden"
      >
        ↓
      </motion.div>
    </div>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
      {/* Section header */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 md:mb-16"
      >
        <p className="text-xs font-mono text-indigo-400/70 uppercase tracking-widest mb-3">
          How it works
        </p>
        <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold text-foreground">
          From vague idea to precise spec
        </h2>
      </motion.div>

      {/* Live demo cards */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6 mb-16 md:mb-20">
        <div className="flex-1">
          <InputCard inView={inView} />
        </div>
        <ProcessingArrow inView={inView} />
        <div className="flex-1">
          <OutputCard inView={inView} />
        </div>
      </div>

      {/* 3-step explainer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9 + i * 0.15, duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-2"
          >
            <span className="text-xs font-mono text-indigo-400/50 tracking-widest">
              {step.number}
            </span>
            <h3 className="text-sm font-semibold text-foreground font-[family-name:var(--font-sora)]">
              {step.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
