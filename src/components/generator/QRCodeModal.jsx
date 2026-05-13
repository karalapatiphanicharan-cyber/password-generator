import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { RiCloseLine, RiDownloadLine, RiFileCopyLine } from 'react-icons/ri';
import { copyToClipboard } from '../../utils/passwordUtils';
import toast from 'react-hot-toast';

export default function QRCodeModal({ password, onClose }) {
  const handleCopy = async () => {
    await copyToClipboard(password);
    toast.success('Password copied!');
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 300; canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#1a1b2e';
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 25, 25, 250, 250);
      const a = document.createElement('a');
      a.download = 'password-qr.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div
          className="relative glass-card p-6 max-w-sm w-full z-10 space-y-5"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">QR Code</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <RiCloseLine />
            </button>
          </div>

          <p className="text-sm text-white/50">Scan this QR code to transfer the password to your phone.</p>

          {/* QR Code */}
          <div className="flex justify-center p-4 bg-white rounded-2xl">
            <QRCodeSVG
              id="qr-svg"
              value={password}
              size={200}
              bgColor="#ffffff"
              fgColor="#1a1b2e"
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Password preview */}
          <div className="p-3 rounded-xl bg-black/30 border border-white/10">
            <p className="font-mono text-xs text-cyan-400 break-all">{password}</p>
          </div>

          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
              <RiFileCopyLine /> Copy
            </button>
            <button onClick={handleDownloadQR} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
              <RiDownloadLine /> Download
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
