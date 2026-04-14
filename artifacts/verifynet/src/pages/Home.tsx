import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, AlertTriangle, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RuleResult {
  ruleName: string;
  status: string;
  reason: string;
}

interface DemoResponse {
  status: string;
  reason: string;
  confidence: string;
  evidenceId: string;
  ruleResults: RuleResult[];
}

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
      
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" />
            <span className="font-display font-bold text-lg tracking-tight">VerifyNet</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-mono text-muted-foreground">
            <a href="#problem" className="hover:text-white transition-colors">Problem</a>
            <a href="#solution" className="hover:text-white transition-colors">Trust Gate</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
          </div>
          <a href="#architecture">
            <Button variant="outline" className="font-mono text-xs rounded-none border-white/20 hover:bg-white hover:text-black transition-all">
              DOCUMENTATION
            </Button>
          </a>
        </div>
      </nav>

      <main>
        <section className="pt-40 pb-24 md:pt-56 md:pb-32 px-6 container mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -z-10" />
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="flex items-center gap-3 mb-8">
                <div className="h-[1px] w-8 bg-white/40" />
                <span className="font-mono text-sm tracking-wider text-white/60 uppercase">The Trust Layer for Autonomous AI</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tighter mb-8"
              >
                The Trust Layer for Autonomous AI
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-4 font-light"
              >
                AI systems execute tasks. VerifyNet decides if they're telling the truth.
              </motion.p>

              <motion.p 
                variants={fadeIn}
                className="text-base text-muted-foreground/70 max-w-xl mb-12"
              >
                Trust Gate is a deterministic enforcement layer that prevents AI systems from self-verifying false success.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Button data-testid="button-run-validation" size="lg" className="rounded-none font-mono h-14 px-8 bg-white text-black hover:bg-white/90" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                  Run a Validation <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
                <Button data-testid="button-view-demo" size="lg" variant="outline" className="rounded-none font-mono h-14 px-8 border-white/20 hover:bg-white/5" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                  View Demo
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="hidden md:block"
            >
              <div className="border border-white/10 bg-black p-8 font-mono text-sm relative">
                <div className="absolute top-0 left-0 w-2 h-2 bg-white/20" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-white/20" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-white/20" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-white/20" />
                
                <div className="text-white/40 text-xs mb-6">TRUST GATE ARCHITECTURE</div>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-28 text-right text-white/30">AI Agent</div>
                    <div className="text-white/20">---&gt;</div>
                    <div className="px-3 py-1 border border-white/20 text-white/70">Claim</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-28" />
                    <div className="text-white/20"> |</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-28" />
                    <div className="text-white/20"> v</div>
                  </div>
                  <div className="border border-white/20 p-4 ml-[7.75rem]">
                    <div className="text-green-400 mb-2">TRUST GATE</div>
                    <div className="text-white/30 space-y-1 text-[10px]">
                      <div>01 Normalization</div>
                      <div>02 Signature Check</div>
                      <div>03 Rule Evaluation</div>
                      <div>04 Confidence Score</div>
                      <div>05 Decision Engine</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-28" />
                    <div className="text-white/20"> |</div>
                  </div>
                  <div className="flex items-center gap-3 justify-center ml-[4rem]">
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20">VALID</div>
                    <div className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20">REJECTED</div>
                    <div className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20">UNKNOWN</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-28" />
                    <div className="text-white/20"> |</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-28 text-right text-white/30">Evidence</div>
                    <div className="text-white/20">&lt;---</div>
                    <div className="px-3 py-1 border border-white/20 text-white/70">Proof Store</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="problem" className="py-24 bg-zinc-950 px-6 border-y border-white/5">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">AI Systems Are Declaring Success — Without Proof</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Today's AI agents execute tasks and declare success without independent verification. Execution is being mistaken for truth.
                </p>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center gap-3 text-red-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Restart services and assume success</span>
                  </div>
                  <div className="flex items-center gap-3 text-red-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Apply fixes without validation</span>
                  </div>
                  <div className="flex items-center gap-3 text-red-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Report completion without external checks</span>
                  </div>
                </div>
                <p className="mt-8 text-2xl font-bold text-destructive">
                  Execution &#8800; Truth
                </p>
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

        <section className="py-24 px-6">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">This Is a Structural Failure — Not a Bug</h2>
              <p className="text-lg text-muted-foreground">
                Most AI systems validate themselves. The entity performing the action is also the entity grading the result. There is no rejection capability. It is a fail-open architecture in a fail-closed domain.
              </p>
              <p className="text-lg text-muted-foreground mt-4">
                In regulated environments, this is unacceptable.
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
                <h2 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">Introducing VerifyNet</h2>
                <p className="text-xl mb-8 text-black/50">The Independent Enforcement Layer for Autonomous Systems</p>
                <p className="text-lg mb-8 text-black/70">
                  VerifyNet sits between execution and proof. Every claim made by an AI system must pass through Trust Gate — a deterministic validation engine that can:
                </p>
                <ul className="space-y-6 font-mono">
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs mt-1 shrink-0">1</div>
                    <div>
                      <strong className="block mb-1 text-base">Accept valid outcomes</strong>
                      <span className="text-black/60 text-sm">High-confidence validation with deterministic rules.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs mt-1 shrink-0">2</div>
                    <div>
                      <strong className="block mb-1 text-base">Reject false success</strong>
                      <span className="text-black/60 text-sm">If any rule fails, the claim is REJECTED. Fail-closed by default.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs mt-1 shrink-0">3</div>
                    <div>
                      <strong className="block mb-1 text-base">Return UNKNOWN when certainty is insufficient</strong>
                      <span className="text-black/60 text-sm">Low confidence evaluates to UNKNOWN. Only high confidence equals VALID.</span>
                    </div>
                  </li>
                </ul>
                <p className="mt-8 font-bold text-lg text-green-700">
                  No system is allowed to declare success without independent validation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="architecture" className="py-24 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">How Trust Gate Works</h2>
            <p className="text-center text-muted-foreground mb-16 font-mono">
              Claim &rarr; Validation Pipeline &rarr; Decision &rarr; Proof
            </p>
            
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
              <div className="text-green-400">if (all_valid &amp;&amp; high_confidence) return VALID;</div>
            </div>

            <p className="mt-8 text-center text-xl font-bold text-destructive">
              The system has the power to say NO.
            </p>
          </div>
        </section>

        <section id="demo" className="py-24 px-6 border-y border-white/10 bg-zinc-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="container mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 font-mono text-xs mb-6 text-white">LIVE ENGINE DEMO</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Watch an AI Get Rejected</h2>
              <p className="text-muted-foreground">
                Send a claim to the Trust Gate API. The agent claims it restarted a service, but the before/after state is identical. Trust Gate catches the lie.
              </p>
            </div>

            <DemoConsole />
          </div>
        </section>

        <section className="py-24 px-6 bg-zinc-950 border-t border-white/5">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Legacy AI vs VerifyNet</h2>
            <div className="border border-white/10 overflow-hidden">
              <table className="w-full font-mono text-sm" data-testid="table-comparison">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 text-white/50 font-normal">Legacy Systems</th>
                    <th className="text-left p-6 text-white font-normal border-l border-white/10">VerifyNet</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Self-declared success", "Independent validation"],
                    ["Fail-open", "Fail-closed"],
                    ["Execution = success", "Validation = success"],
                    ["No rejection capability", "Can reject false outcomes"]
                  ].map(([legacy, verifynet], i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="p-6 text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                          {legacy}
                        </div>
                      </td>
                      <td className="p-6 text-white border-l border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          {verifynet}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white text-black clip-diagonal flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 max-w-4xl">
              AI Needs a Trust Layer
            </h2>
            <p className="text-xl md:text-2xl text-black/60 max-w-2xl mb-4">
              As AI systems become autonomous, trust cannot be assumed.
            </p>
            <p className="text-xl md:text-2xl text-black/60 max-w-2xl mb-12">
              It must be enforced. VerifyNet is the layer that makes autonomous systems accountable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#demo">
                <Button data-testid="button-get-early-access" size="lg" className="rounded-none font-mono h-14 px-8 bg-black text-white hover:bg-black/90">
                  Get Early Access
                </Button>
              </a>
              <a href="#architecture">
                <Button data-testid="button-view-api-docs" size="lg" variant="outline" className="rounded-none font-mono h-14 px-8 border-black/20 text-black hover:bg-black/5">
                  View API Docs
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t border-white/10 px-6 font-mono text-xs text-white/40 flex justify-between items-center">
        <div>VerifyNet &copy; {new Date().getFullYear()} — The Trust Layer for Autonomous Systems</div>
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
  const [response, setResponse] = useState<DemoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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
    setError(null);
    
    try {
      const res = await fetch(`/trust-gate/validate-recovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.status && data.evidenceId) {
        setResponse(data);
      } else if (!res.ok) {
        setError(`Trust Gate returned HTTP ${res.status}: ${JSON.stringify(data)}`);
      } else {
        setResponse(data);
      }
    } catch (err) {
      setError("Trust Gate API is not reachable. Ensure the service is running.");
    }
    
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col">
        <div className="bg-white/5 border border-white/10 px-4 py-2 font-mono text-xs text-white/50 border-b-0 flex justify-between items-center">
          <span>POST /trust-gate/validate-recovery</span>
          <span className="text-white/30">AGENT CLAIM</span>
        </div>
        <div className="bg-black border border-white/10 p-6 font-mono text-sm overflow-auto h-[320px] shadow-2xl relative group">
          <pre className="text-white/70" data-testid="text-demo-payload">
            {JSON.stringify(payload, null, 2)}
          </pre>
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button data-testid="button-send-request" onClick={runDemo} disabled={loading} className="rounded-none font-mono text-xs bg-white text-black hover:bg-white/90">
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
            {!response && !loading && !error && (
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

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-6"
              >
                <AlertTriangle className="w-8 h-8 text-amber-400" />
                <p className="text-amber-400 text-sm" data-testid="text-demo-error">{error}</p>
              </motion.div>
            )}
            
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className={`absolute top-0 right-0 px-2 py-1 text-[10px] font-bold ${
                  response.status === 'VALID' ? 'bg-green-500/20 text-green-400' :
                  response.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                  'bg-amber-500/20 text-amber-400'
                }`} data-testid="text-demo-verdict">
                  {response.status}
                </div>
                <pre className="text-white/70 mt-4" data-testid="text-demo-response">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="lg:col-span-2 flex justify-center">
        <Button data-testid="button-run-live-demo" onClick={runDemo} disabled={loading} size="lg" className="rounded-none font-mono bg-white text-black hover:bg-white/90 h-14 px-12">
          {loading ? 'EXECUTING...' : 'Run Live Demo'}
        </Button>
      </div>
    </div>
  );
}
