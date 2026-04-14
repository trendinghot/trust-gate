import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, AlertTriangle, CheckCircle2, ChevronRight, Server, Database, Lock, Eye, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-white/20">
      <div className="noise-overlay" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" />
            <span className="font-display font-bold text-lg tracking-tight">VerifyNet</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-mono text-muted-foreground">
            <a href="#problem" className="hover:text-white transition-colors">Problem</a>
            <a href="#solution" className="hover:text-white transition-colors">Trust Gate</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Engine</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          </div>
          <Button variant="outline" className="font-mono text-xs rounded-none border-white/20 hover:bg-white hover:text-black transition-all">
            DOCUMENTATION
          </Button>
        </div>
      </nav>

      <main>
        {/* Section 1: Hero */}
        <section className="pt-40 pb-24 md:pt-56 md:pb-32 px-6 container mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -z-10" />
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeIn} className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-8 bg-white/40" />
              <span className="font-mono text-sm tracking-wider text-white/60 uppercase">The Trust Layer for Autonomous AI</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeIn}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tighter mb-8"
            >
              The system has<br />
              the power to <span className="text-destructive glitch-text" data-text="say NO.">say NO.</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light"
            >
              AI systems execute tasks. VerifyNet decides if they're telling the truth. Independent enforcement for deterministic validation.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-none font-mono h-14 px-8 bg-white text-black hover:bg-white/90" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                INITIATE TRUST GATE <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-none font-mono h-14 px-8 border-white/20 hover:bg-white/5">
                READ THE PAPER
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 2: The Problem */}
        <section id="problem" className="py-24 bg-zinc-950 px-6 border-y border-white/5">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Execution is being mistaken for truth.</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Autonomous agents operate in a vacuum of accountability. They declare a task "complete" and the system accepts it as fact. There is no independent auditor, no skeptical observer. Execution is assumed to be validation.
                </p>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center gap-3 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Agent: "Restarted degraded service successfully."</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40">
                    <Activity className="w-4 h-4" />
                    <span>Reality: Service remains degraded. Agent hallucinated success.</span>
                  </div>
                  <div className="flex items-center gap-3 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>System: Accepts agent state. Cascading failure ensues.</span>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square border border-white/10 bg-black p-8 flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-2 h-2 bg-white/20" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-white/20" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-white/20" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-white/20" />
                
                <div className="font-mono text-xs text-white/40 mb-4">LOG // AGENT_EXECUTION_TRACE</div>
                <div className="space-y-2 flex-grow overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10" />
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="font-mono text-xs text-white/20 opacity-50">
                      [{new Date().toISOString()}] DEBUG: Execution step {i} completed
                    </div>
                  ))}
                  <div className="font-mono text-xs text-green-400 mt-4">
                    [{new Date().toISOString()}] SUCCESS: Agent reported full recovery.
                  </div>
                </div>
                <div className="mt-8 border-t border-white/10 pt-4 font-mono text-sm text-destructive font-bold">
                  FATAL: FALSE POSITIVE DETECTED
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Structural Failure */}
        <section className="py-24 px-6">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Most AI validates itself.</h2>
              <p className="text-lg text-muted-foreground">
                The current paradigm relies on a fatal flaw: the entity performing the action is also the entity grading the result. There is no rejection capability. It is a fail-open architecture in a fail-closed domain.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Search, title: "Self-Declared Success", desc: "Agents mark their own homework, leading to systemic hallucination." },
                { icon: Shield, title: "No Independent Layer", desc: "No infrastructure exists to cross-reference intent with actual system state." },
                { icon: AlertTriangle, title: "Fail-Open Default", desc: "Unknown states default to valid, creating massive security vulnerabilities." }
              ].map((item, i) => (
                <div key={i} className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <item.icon className="w-8 h-8 text-white/40 mb-6" />
                  <h3 className="font-display font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: The Solution (Trust Gate) */}
        <section id="solution" className="py-24 px-6 bg-white text-black">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-black p-6 flex flex-col justify-between text-white">
                    <span className="font-mono text-sm text-white/50">OUTPUT 01</span>
                    <span className="font-display font-bold text-3xl text-green-400">VALID</span>
                  </div>
                  <div className="aspect-square bg-black p-6 flex flex-col justify-between text-white">
                    <span className="font-mono text-sm text-white/50">OUTPUT 02</span>
                    <span className="font-display font-bold text-3xl text-red-500">REJECTED</span>
                  </div>
                  <div className="col-span-2 bg-zinc-100 p-6 flex flex-col justify-between border border-black/10">
                    <span className="font-mono text-sm text-black/50">OUTPUT 03</span>
                    <span className="font-display font-bold text-3xl text-amber-500">UNKNOWN</span>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Trust Gate</h2>
                <p className="text-xl mb-8 text-black/70">
                  VerifyNet introduces an independent enforcement engine. It sits between the agent's execution and the system's acceptance.
                </p>
                <ul className="space-y-6 font-mono">
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs mt-1 shrink-0">1</div>
                    <div>
                      <strong className="block mb-1 text-base">Deterministic Rules</strong>
                      <span className="text-black/60 text-sm">Rules are math, not prompts. They either pass or fail.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs mt-1 shrink-0">2</div>
                    <div>
                      <strong className="block mb-1 text-base">Fail-Closed Architecture</strong>
                      <span className="text-black/60 text-sm">If any rule fails, the claim is REJECTED.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs mt-1 shrink-0">3</div>
                    <div>
                      <strong className="block mb-1 text-base">Confidence Scoring</strong>
                      <span className="text-black/60 text-sm">Low confidence evaluates to UNKNOWN. Only high confidence equals VALID.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Live Demo */}
        <section id="demo" className="py-24 px-6 border-y border-white/10 bg-zinc-950 relative overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="container mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 font-mono text-xs mb-6 text-white">LIVE ENGINE DEMO</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Test the Auditor</h2>
              <p className="text-muted-foreground">
                Send a claim to the Trust Gate API. We simulate an agent claiming it successfully restarted a service, but the before/after state is identical. Trust Gate will catch the lie.
              </p>
            </div>

            <DemoConsole />
          </div>
        </section>

        {/* Section 6: How it works */}
        <section id="architecture" className="py-24 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">7-Step Validation Pipeline</h2>
            
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 hidden md:block" />
              <div className="grid md:grid-cols-7 gap-4 relative z-10">
                {[
                  "Normalization",
                  "Signature Verification",
                  "Context Reconstruction",
                  "Rule Evaluation",
                  "Signal Analysis",
                  "Confidence Assessment",
                  "Decision Authority"
                ].map((step, i) => (
                  <div key={i} className="bg-background border border-white/10 p-4 relative group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-mono text-xs text-white/50 mb-4 group-hover:bg-white group-hover:text-black transition-colors">
                      0{i + 1}
                    </div>
                    <h3 className="font-display font-medium text-sm">{step}</h3>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-20 max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 font-mono text-sm leading-relaxed">
              <div className="text-white/40 mb-4">// DECISION LOGIC</div>
              <div className="text-red-400">if (any_rule_fails) return REJECTED;</div>
              <div className="text-amber-400">if (confidence &lt; threshold) return UNKNOWN;</div>
              <div className="text-green-400">return VALID;</div>
            </div>
          </div>
        </section>

        {/* Section 7: Comparison */}
        <section className="py-24 px-6 bg-zinc-950 border-t border-white/5">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
              <div className="bg-background p-12">
                <h3 className="font-mono text-white/50 mb-8 pb-4 border-b border-white/10">LEGACY AI STACK</h3>
                <ul className="space-y-6">
                  {[
                    "Self-declared success",
                    "Fail-open architecture",
                    "Probabilistic verification",
                    "No independent rejection",
                    "Assumed trust"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-background p-12">
                <h3 className="font-mono text-white mb-8 pb-4 border-b border-white/10">VERIFYNET STACK</h3>
                <ul className="space-y-6">
                  {[
                    "Independent validation",
                    "Fail-closed architecture",
                    "Deterministic enforcement",
                    "Hard rejection capability",
                    "Enforced trust"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Final Close */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white text-black clip-diagonal flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 max-w-4xl">
              AI Needs a Trust Layer.
            </h2>
            <p className="text-xl md:text-2xl text-black/60 max-w-2xl mb-12">
              As AI becomes autonomous, trust must be enforced, not assumed. Build on the infrastructure that guarantees truth.
            </p>
            <Button size="lg" className="rounded-none font-mono h-14 px-8 bg-black text-white hover:bg-black/90">
              REQUEST EARLY ACCESS
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t border-white/10 px-6 font-mono text-xs text-white/40 flex justify-between items-center">
        <div>© {new Date().getFullYear()} VerifyNet Inc. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
        </div>
      </footer>
    </div>
  );
}

function DemoConsole() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  
  const payload = {
    actionType: "service-restart",
    systemId: "demo-agent",
    timestamp: new Date().toISOString(),
    payload: { service: "payment-processor", action: "restart" },
    beforeState: { status: "degraded", uptime: 3400 },
    afterState: { status: "degraded", uptime: 3400 }
  };

  const runDemo = async () => {
    setLoading(true);
    setResponse(null);
    
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}../trust-gate/validate-recovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setTimeout(() => {
        setResponse({
          status: "REJECTED",
          reason: "Before and after states are identical — no change detected",
          confidence: "HIGH",
          evidenceId: "demo-fallback-" + Date.now(),
          ruleResults: [
            { ruleName: "schema-completeness", status: "VALID", reason: "All required fields present" },
            { ruleName: "timestamp-freshness", status: "VALID", reason: "Timestamp is fresh" },
            { ruleName: "action-type-allowlist", status: "VALID", reason: "Action type \"service-restart\" is allowed" },
            { ruleName: "state-diff", status: "REJECTED", reason: "Before and after states are identical — no change detected" }
          ]
        });
        setLoading(false);
      }, 1500);
      return;
    }
    
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col">
        <div className="bg-white/5 border border-white/10 px-4 py-2 font-mono text-xs text-white/50 border-b-0 flex justify-between items-center">
          <span>POST /api/v1/validate-recovery</span>
          <span className="text-white/30">AGENT CLAIM</span>
        </div>
        <div className="bg-black border border-white/10 p-6 font-mono text-sm overflow-auto h-[320px] shadow-2xl relative group">
          <pre className="text-white/70">
            {JSON.stringify(payload, null, 2)}
          </pre>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button onClick={runDemo} disabled={loading} className="rounded-none font-mono text-xs bg-white text-black hover:bg-white/90">
              {loading ? (
                <>EXECUTING<span className="animate-pulse">...</span></>
              ) : (
                <>SEND REQUEST <ChevronRight className="w-3 h-3 ml-1" /></>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="bg-white/5 border border-white/10 px-4 py-2 font-mono text-xs text-white/50 border-b-0 flex justify-between items-center">
          <span>RESPONSE</span>
          <span className="text-white/30">TRUST GATE</span>
        </div>
        <div className="bg-black border border-white/10 p-6 font-mono text-sm overflow-auto h-[320px] shadow-2xl relative">
          <AnimatePresence mode="wait">
            {!response && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center text-white/20"
              >
                Waiting for request...
              </motion.div>
            )}
            
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 backdrop-blur-sm z-10"
              >
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-white/50 animate-pulse">EVALUATING PIPELINE</span>
              </motion.div>
            )}
            
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className={`absolute top-0 right-0 px-2 py-1 text-[10px] font-bold ${
                  (response.status || response.verdict) === 'VALID' ? 'bg-green-500/20 text-green-400' :
                  (response.status || response.verdict) === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {response.status || response.verdict}
                </div>
                <pre className="text-white/70 mt-4">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile button */}
      <div className="lg:hidden flex justify-center mt-4">
        <Button onClick={runDemo} disabled={loading} size="lg" className="w-full rounded-none font-mono bg-white text-black hover:bg-white/90">
          {loading ? 'EXECUTING...' : 'RUN LIVE DEMO'}
        </Button>
      </div>
    </div>
  );
}
