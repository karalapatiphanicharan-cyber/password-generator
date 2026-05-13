import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiEyeLine, RiEyeOffLine, RiFileCopyLine, RiCheckLine, RiRefreshLine, RiQrCodeLine, RiSaveLine } from 'react-icons/ri';
import { copyToClipboard } from '../../utils/passwordUtils';
import toast from 'react-hot-toast';

export default function PasswordDisplay({ password, onRegenerate, onSave, onShowQR, isSaving }) {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!password) return;
    const success = await copyToClipboard(password);
    if (success) {
      setCopied(true);
      toast.success('Password copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const displayPassword = visible ? password : '•'.repeat(password?.length || 0);

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Password output box */}
      <div className="relative group">
        <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/10 min-h-[64px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={password}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="password-display break-all pr-4 select-all leading-relaxed text-base sm:text-lg"
              aria-label="Generated password"
            >
              {displayPassword || <span className="text-white/30 italic font-sans text-sm">Click generate to create a password…</span>}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Copy */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          disabled={!password}
          className="btn-primary flex items-center gap-2 flex-1 min-w-[100px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Copy password"
        >
          {copied ? <RiCheckLine className="text-lg" /> : <RiFileCopyLine className="text-lg" />}
          {copied ? 'Copied!' : 'Copy'}
        </motion.button>

        {/* Regenerate */}
        <motion.button
          whileTap={{ scale: 0.95, rotate: 180 }}
          onClick={onRegenerate}
          className="btn-secondary flex items-center gap-2 flex-1 min-w-[100px] justify-center"
          aria-label="Regenerate password"
        >
          <motion.span whileTap={{ rotate: 360 }} transition={{ duration: 0.4 }}>
            <RiRefreshLine className="text-lg" />
          </motion.span>
          Regenerate
        </motion.button>

        {/* Visibility toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setVisible(v => !v)}
          disabled={!password}
          className="btn-secondary w-11 h-11 flex items-center justify-center disabled:opacity-50"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <RiEyeOffLine className="text-lg" /> : <RiEyeLine className="text-lg" />}
        </motion.button>

        {/* QR Code */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onShowQR}
          disabled={!password}
          className="btn-secondary w-11 h-11 flex items-center justify-center disabled:opacity-50"
          aria-label="Show QR code"
          title="Show QR Code"
        >
          <RiQrCodeLine className="text-lg" />
        </motion.button>

        {/* Save to history */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          disabled={!password || isSaving}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          title="Save to history (requires login)"
          aria-label="Save password"
        >
          <RiSaveLine className="text-lg" />
          {isSaving ? 'Saving…' : 'Save'}
        </motion.button>
      </div>
    </div>
  );
}
