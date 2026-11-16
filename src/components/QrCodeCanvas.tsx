import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';

interface QrCodeCanvasProps {
  value: string;
  size?: number;
  title: string;
  caption?: string;
  darkColor?: string;
  downloadFilename?: string;
  showDownload?: boolean;
}

export function QrCodeCanvas({
  value,
  size = 180,
  title,
  caption,
  darkColor = '#0F172A',
  downloadFilename = 'qr-code.png',
  showDownload = true,
}: QrCodeCanvasProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: darkColor,
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (active) {
          setDataUrl(url);
          setHasError(false);
        }
      })
      .catch(() => {
        if (active) {
          setHasError(true);
        }
      });

    return () => {
      active = false;
    };
  }, [value, size, darkColor]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = downloadFilename;
    link.click();
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center"
        style={{ width: size + 24, height: size + 24 }}
      >
        {dataUrl && !hasError ? (
          <img
            src={dataUrl}
            alt={title}
            width={size}
            height={size}
            className="w-full h-full object-contain block"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
            <QrCode className="w-10 h-10" />
            <span className="text-xs">جاري إنشاء الرمز</span>
          </div>
        )}
      </div>

      {caption && (
        <p className="mt-2.5 text-xs text-slate-600 max-w-[220px] leading-relaxed">
          {caption}
        </p>
      )}

      {showDownload && dataUrl && !hasError && (
        <button
          type="button"
          onClick={handleDownload}
          className="no-print mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>حفظ صورة QR</span>
        </button>
      )}
    </div>
  );
}
