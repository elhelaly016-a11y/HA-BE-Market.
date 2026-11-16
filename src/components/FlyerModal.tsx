import { X } from 'lucide-react';

interface FlyerModalProps {
  open: boolean;
  imageSrc: string;
  title: string;
  onClose: () => void;
}

export function FlyerModal({ open, imageSrc, title, onClose }: FlyerModalProps) {
  if (!open) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-[#F8F8F6]">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[82vh] overflow-auto bg-slate-100 flex justify-center">
          <img
            src={imageSrc}
            alt={title}
            className="max-w-full h-auto rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
