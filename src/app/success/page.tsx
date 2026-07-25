import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-16 h-16 mx-auto flex items-center justify-center text-emerald-400">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-100">Welcome to LocalVault Pro!</h1>
      <p className="text-sm text-slate-400 leading-relaxed">
        Your payment was processed successfully. You now have full access to higher limits, OCR, PII redaction, and batch processing.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
      >
        Start Processing
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
