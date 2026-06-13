import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

export function AboutDialog({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/20 px-4">
      <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-md bg-accent text-xl font-bold text-white">
              OC
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-ink">OpenConvert</h2>
              <p className="text-sm text-slate-500">Version 0.1.0</p>
            </div>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close about dialog">
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
          <p>Fast, local-first file conversion for Windows.</p>
          <p>Files never leave your computer.</p>
          <p>Created by Sparsh Sam</p>
          <p>
            GitHub:{" "}
            <a className="link" href="https://github.com/sparshsam">
              https://github.com/sparshsam
            </a>
          </p>
          <p>Licensed under AGPL-3.0</p>
        </div>
      </section>
    </div>
  );
}
