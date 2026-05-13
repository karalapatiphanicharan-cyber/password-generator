import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiHistoryLine, RiDeleteBinLine, RiFileCopyLine, RiSearchLine,
  RiDownloadLine, RiRefreshLine, RiCheckLine,
} from 'react-icons/ri';
import { getStrengthConfig, copyToClipboard, exportPasswords } from '../utils/passwordUtils';
import toast from 'react-hot-toast';

// ─── localStorage helpers ─────────────────────────────────────────────────────
const getStored = () => JSON.parse(localStorage.getItem('pw_history') || '[]');
const setStored = (data) => localStorage.setItem('pw_history', JSON.stringify(data));

function HistoryItem({ item, onDelete, onCopy }) {
  const [copied, setCopied] = useState(false);
  const config = getStrengthConfig(item.strength);

  const handleCopy = async () => {
    await onCopy(item.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className="glass-card p-4 flex items-center gap-4"
    >
      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${config.color}`} />

      <div className="flex-1 min-w-0">
        {/* Show masked password */}
        <p className="font-mono text-sm text-white/80 truncate">
          {'•'.repeat(Math.min(item.length, 24))}{item.length > 24 ? '…' : ''}
        </p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className={`badge badge-${item.strength} text-xs`}>{config.label}</span>
          <span className="text-xs text-white/30">{item.length} chars</span>
          <span className="text-xs text-white/30">{item.entropy} bits</span>
          <span className="text-xs text-white/20">{date}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopy}
          className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-white/50 hover:text-white transition-colors"
          title="Copy password">
          {copied ? <RiCheckLine className="text-green-400" /> : <RiFileCopyLine />}
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => onDelete(item._id)}
          className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-white/50 hover:text-red-400 transition-colors"
          title="Delete">
          <RiDeleteBinLine />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');

  // Load from localStorage
  const load = useCallback(() => {
    const all = getStored();
    if (search.trim()) {
      setHistory(all.filter(h => h.strength?.toLowerCase().includes(search.toLowerCase())));
    } else {
      setHistory(all);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = (id) => {
    const updated = getStored().filter(h => h._id !== id);
    setStored(updated);
    setHistory(prev => prev.filter(h => h._id !== id));
    toast.success('Password deleted.');
  };

  const handleCopy = async (password) => {
    await copyToClipboard(password);
    toast.success('Copied to clipboard!');
  };

  const handleExport = () => {
    const all = getStored();
    if (!all.length) return toast.error('No passwords to export.');
    exportPasswords(all);
    toast.success('Exported successfully!');
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all saved passwords?')) return;
    setStored([]);
    setHistory([]);
    toast.success('History cleared.');
  };

  return (
    <div className="page-transition space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <RiHistoryLine className="text-primary-400" />
            Password History
          </h1>
          <p className="text-white/50 mt-1 text-sm">
            {history.length} passwords · saved locally in your browser
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-secondary flex items-center gap-2 text-sm px-3 py-2">
            <RiRefreshLine /> Refresh
          </button>
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm px-3 py-2">
            <RiDownloadLine /> Export
          </button>
          <button onClick={handleClearAll} className="btn-danger flex items-center gap-2 text-sm px-3 py-2">
            <RiDeleteBinLine /> Clear All
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by strength: weak, medium, strong, very-strong…"
          className="input-field pl-11"
        />
      </div>

      {/* List */}
      {history.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card p-12 text-center space-y-3">
          <RiHistoryLine className="text-5xl text-white/20 mx-auto" />
          <p className="text-white/50 font-medium">No passwords saved yet</p>
          <p className="text-white/30 text-sm">
            Go to the Generator page and click <strong>Save</strong> to add passwords here.
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-2">
            {history.map(item => (
              <HistoryItem key={item._id} item={item} onDelete={handleDelete} onCopy={handleCopy} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
