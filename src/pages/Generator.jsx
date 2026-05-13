import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RiLockPasswordLine, RiSearchLine } from 'react-icons/ri';
import PasswordDisplay from '../components/generator/PasswordDisplay';
import StrengthMeter from '../components/generator/StrengthMeter';
import GeneratorOptions from '../components/generator/GeneratorOptions';
import QRCodeModal from '../components/generator/QRCodeModal';
import { generatePasswordClient, analyzeStrength } from '../utils/passwordUtils';
import api from '../utils/api';
import toast from 'react-hot-toast';

// Keyboard shortcut: Ctrl+G to regenerate, Ctrl+C to copy
const DEFAULT_OPTIONS = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
  excludeSimilar: false,
  noRepeats: false,
  mode: 'standard',
};

export default function Generator() {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [showQR, setShowQR] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analyzeInput, setAnalyzeInput] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState(null);

  // Generate on mount and whenever options change
  const generate = useCallback(() => {
    let pw;
    if (options.mode === 'passphrase') {
      const words = ['Crystal','Storm','Eagle','Quantum','Cipher','Nova','Blazing','Frozen'];
      const w = () => words[Math.floor(Math.random() * words.length)];
      const num = Math.floor(Math.random() * 90) + 10;
      pw = `${w()}-${w()}-${num}-${w()}`;
    } else if (options.mode === 'banking') {
      pw = generatePasswordClient({ length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: true });
    } else if (options.mode === 'wifi') {
      pw = generatePasswordClient({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: false });
    } else {
      pw = generatePasswordClient(options);
    }
    setPassword(pw);
    setAnalysis(analyzeStrength(pw));
  }, [options]);

  useEffect(() => { generate(); }, [generate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') { e.preventDefault(); generate(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [generate]);

  const handleSave = () => {
    if (!password) return;
    setIsSaving(true);

    try {
      // Save to localStorage — works 100% offline, no backend needed
      const existing = JSON.parse(localStorage.getItem('pw_history') || '[]');
      const entry = {
        _id: Date.now().toString(),
        password,
        strength: analysis?.strength || 'medium',
        strengthScore: analysis?.score || 0,
        entropy: analysis?.entropy || 0,
        length: password.length,
        settings: options,
        createdAt: new Date().toISOString(),
      };
      // Keep max 100 entries, newest first
      const updated = [entry, ...existing].slice(0, 100);
      localStorage.setItem('pw_history', JSON.stringify(updated));
      toast.success('Password saved to history!');
    } catch {
      toast.error('Failed to save password.');
    } finally {
      setIsSaving(false);
    }
  };

  // Analyze a custom input password
  const handleAnalyze = () => {
    if (!analyzeInput.trim()) return toast.error('Enter a password to analyze.');
    setAnalyzeResult(analyzeStrength(analyzeInput));
  };

  return (
    <div className="page-transition max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <RiLockPasswordLine className="text-primary-400" />
          Password Generator
        </h1>
        <p className="text-white/50 mt-1 text-sm">
          Press <kbd className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono">Ctrl+G</kbd> to regenerate
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: options */}
        <div className="lg:col-span-1">
          <GeneratorOptions options={options} onChange={setOptions} />
        </div>

        {/* Right: output + strength */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <PasswordDisplay
              password={password}
              onRegenerate={generate}
              onSave={handleSave}
              onShowQR={() => setShowQR(true)}
              isSaving={isSaving}
            />
          </motion.div>

          {analysis && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <StrengthMeter {...analysis} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Analyze your own password section */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="font-semibold text-white/90 flex items-center gap-2">
          <RiSearchLine className="text-primary-400" />
          Analyze Any Password
        </h2>
        <p className="text-xs text-white/40">Check the strength of an existing password. It is never sent to the server.</p>
        <div className="flex gap-3">
          <input
            type="password"
            value={analyzeInput}
            onChange={e => { setAnalyzeInput(e.target.value); setAnalyzeResult(analyzeStrength(e.target.value)); }}
            placeholder="Type or paste a password to analyze…"
            className="input-field flex-1 font-mono"
          />
          <button onClick={handleAnalyze} className="btn-primary px-5 whitespace-nowrap">Analyze</button>
        </div>
        {analyzeResult && analyzeInput && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <StrengthMeter {...analyzeResult} />
          </motion.div>
        )}
      </div>

      {/* QR Modal */}
      {showQR && password && <QRCodeModal password={password} onClose={() => setShowQR(false)} />}
    </div>
  );
}
