import Link from "next/link";
import { Lock, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-slate-200">LocalVault</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              100% Client-Side Document Processing. Zero server uploads. Your data never leaves your device.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Tools</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/tools/pdf-watermark" className="hover:text-slate-200">PDF Watermark</Link></li>
              <li><Link href="/tools/pdf-compress" className="hover:text-slate-200">PDF Compress</Link></li>
              <li><Link href="/tools/pdf-ocr" className="hover:text-slate-200">PDF OCR</Link></li>
              <li><Link href="/tools/pii-redact" className="hover:text-slate-200">PII Redaction</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/pricing" className="hover:text-slate-200">Pricing</Link></li>
              <li><a href="#verify" className="hover:text-slate-200">Verify Privacy</a></li>
              <li><a href="https://github.com/localvault" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200">GitHub Repository</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Privacy First</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered with WebAssembly & Web APIs. Open source and verifiable in DevTools.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/30 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LocalVault. All processing remains on your browser.</p>
          <div className="flex items-center gap-1">
            <span>Built for privacy with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}
