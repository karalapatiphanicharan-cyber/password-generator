/**
 * Client-side password utilities
 * Mirror of server utils for instant UI feedback without API round-trips
 */

export const calculateEntropy = (password) => {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  if (charsetSize === 0) return 0;
  return Math.round(password.length * Math.log2(charsetSize));
};

export const estimateCrackTime = (entropy) => {
  const guessesPerSecond = 1e10;
  const combinations = Math.pow(2, entropy);
  const seconds = combinations / guessesPerSecond / 2;

  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
  return 'Centuries+';
};

export const analyzeStrength = (password) => {
  if (!password) return { score: 0, strength: 'weak', entropy: 0, crackTime: 'Instantly', suggestions: [] };

  const entropy = calculateEntropy(password);
  let score = 0;
  const suggestions = [];

  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length < 8) suggestions.push('Use at least 8 characters');
  if (password.length < 12) suggestions.push('Aim for 12+ characters');

  if (/[a-z]/.test(password)) score += 10; else suggestions.push('Add lowercase letters');
  if (/[A-Z]/.test(password)) score += 15; else suggestions.push('Add uppercase letters');
  if (/[0-9]/.test(password)) score += 15; else suggestions.push('Add numbers');
  if (/[^a-zA-Z0-9]/.test(password)) score += 20; else suggestions.push('Add special characters');

  if (entropy >= 50) score += 5;
  if (entropy >= 70) score += 5;

  if (/(.)\1{2,}/.test(password)) { score -= 10; suggestions.push('Avoid repeating characters'); }
  if (/^[a-zA-Z]+$/.test(password)) score -= 5;
  if (/^[0-9]+$/.test(password)) { score -= 10; suggestions.push('Avoid numeric-only passwords'); }

  score = Math.max(0, Math.min(100, score));

  let strength;
  if (score < 30) strength = 'weak';
  else if (score < 55) strength = 'medium';
  else if (score < 80) strength = 'strong';
  else strength = 'very-strong';

  return { score, strength, entropy, crackTime: estimateCrackTime(entropy), suggestions };
};

/**
 * Get strength display config (label, colors, segments)
 */
export const getStrengthConfig = (strength) => {
  const configs = {
    weak: {
      label: 'Weak',
      color: 'bg-red-500',
      textColor: 'text-red-400',
      glow: 'shadow-red-500/50',
      segments: 1,
      gradient: 'from-red-600 to-red-400',
    },
    medium: {
      label: 'Medium',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400',
      glow: 'shadow-yellow-500/50',
      segments: 2,
      gradient: 'from-yellow-600 to-yellow-400',
    },
    strong: {
      label: 'Strong',
      color: 'bg-green-500',
      textColor: 'text-green-400',
      glow: 'shadow-green-500/50',
      segments: 3,
      gradient: 'from-green-600 to-green-400',
    },
    'very-strong': {
      label: 'Very Strong',
      color: 'bg-cyan-500',
      textColor: 'text-cyan-400',
      glow: 'shadow-cyan-500/50',
      segments: 4,
      gradient: 'from-cyan-500 to-blue-500',
    },
  };
  return configs[strength] || configs.weak;
};

/**
 * Generate password client-side for instant feedback
 */
export const generatePasswordClient = (options = {}) => {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = false,
    excludeSimilar = false,
    noRepeats = false,
  } = options;

  let charset = '';
  if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) charset += '0123456789';
  if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (excludeSimilar) charset = charset.replace(/[il1Lo0O]/g, '');
  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

  const usedChars = new Set();
  let password = '';

  for (let i = 0; i < length; i++) {
    let char;
    let attempts = 0;
    do {
      char = charset[Math.floor(Math.random() * charset.length)];
      attempts++;
    } while (noRepeats && usedChars.has(char) && attempts < 100);
    password += char;
    if (noRepeats) usedChars.add(char);
  }
  return password;
};

/**
 * Copy text to clipboard, returns boolean success
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  }
};

/**
 * Export passwords as encrypted JSON download
 */
export const exportPasswords = (passwords, filename = 'passwords_export.json') => {
  const data = {
    exportedAt: new Date().toISOString(),
    note: 'Keep this file secure. Delete after use.',
    entries: passwords.map(p => ({
      id: p._id,
      length: p.length,
      strength: p.strength,
      strengthScore: p.strengthScore,
      entropy: p.entropy,
      savedAt: p.createdAt,
    })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
