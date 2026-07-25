import Link from "next/link";
import { Stamp, FileArchive, FileText, EyeOff, ShieldCheck, ArrowRight, Lock, Zap } from "lucide-react";
import { PrivacyBadge } from "@/components/layout/PrivacyBadge";
import { NetworkMonitor } from "@/components/layout/NetworkMonitor";

export default function HomePage() {
  const tools = [
    {
      title: "PDF Watermarking",
      desc: "Stamp single or repeating text watermarks onto PDF pages with full style control.",
      href: "/tools/pdf-watermark",
      icon: Stamp,
      tag: "Popular",
    },
    {
      title: "PDF Compression",
      desc: "Strip hidden metadata and compress page content directly in client-side memory.",
      href: "/tools/pdf-compress",
      icon: FileArchive,
      tag: "Fast",
    },
    {
      title: "Browser OCR Engine",
      desc: "Extract text from scanned PDFs & images using WebAssembly Tesseract.js.",
      href: "/tools/pdf-ocr",
      icon: FileText,
      tag: "WASM",
    },
    {
      title: "PII Detection & Redaction",
      desc: "Detect and mask SSNs, Credit Cards, Emails, and Phone Numbers automatically.",
      href: "/tools/pii-redact",
      icon: EyeOff,
      tag: "Security",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 max-w-4xl mx-auto">
        <div className="flex justify-center">
          <PrivacyBadge />
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
          Process Sensitive Documents <br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            Without Server Uploads
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          LocalVault processes PDFs, images, and sensitive files 100% inside your browser using WebAssembly. Your data never touches any external server.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/tools/pdf-watermark"
            className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            Start Watermarking Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#verify"
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 font-semibold text-sm transition-all"
          >
            How We Guarantee Privacy
          </a>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
        <div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">100%</div>
          <div className="text-xs text-slate-400 mt-1">Client-Side WASM</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">0 Bytes</div>
          <div className="text-xs text-slate-400 mt-1">Uploaded to Server</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">Offline</div>
          <div className="text-xs text-slate-400 mt-1">Ready Capabilities</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">Open</div>
          <div className="text-xs text-slate-400 mt-1">Verifiable Logic</div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-200">Browser-Based Privacy Tools</h2>
          <p className="text-sm text-slate-400">Select a tool to start processing your document locally</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="group p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-700/30 hover:border-emerald-500/30 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {tool.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                    {tool.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tool.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Verify Privacy Section */}
      <section id="verify" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verifiable Architecture
          </div>
          <h2 className="text-3xl font-bold text-slate-100">Don&apos;t Trust Us? Verify In DevTools.</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Open your browser Developer Tools (F12) → Network tab at any time while using LocalVault. You will observe zero upload requests or data payloads sent to external servers.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Execution runs in WebAssembly & Web Workers</span>
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Built-in network request interceptor blocks leak attempts</span>
            </li>
          </ul>
        </div>

        <div>
          <NetworkMonitor />
        </div>
      </section>
    </div>
  );
}
