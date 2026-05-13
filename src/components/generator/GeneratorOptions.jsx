import {
  RiLockLine, RiFontSize, RiHashtag, RiAtLine,
  RiProhibitedLine, RiRepeatLine, RiBookOpenLine,
  RiSecurePaymentLine, RiWifiLine,
} from 'react-icons/ri';

const Toggle = ({ label, checked, onChange, icon: Icon, description }) => (
  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="text-primary-400 text-lg flex-shrink-0" />}
      <div>
        <p className="text-sm font-medium text-white/90">{label}</p>
        {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
      <div
        className="toggle-track relative w-11 h-6 rounded-full transition-all duration-300"
        style={{
          background: checked ? 'linear-gradient(135deg,#5c7cfa,#7950f2)' : 'rgba(255,255,255,0.1)',
          border: checked ? 'none' : '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <div
          className="toggle-thumb absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300"
          style={{ transform: checked ? 'translateX(1.25rem)' : 'translateX(0)' }}
        />
      </div>
    </div>
  </label>
);

const ModeButton = ({ value, current, onChange, label, icon: Icon, description }) => (
  <button
    onClick={() => onChange(value)}
    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
      current === value
        ? 'border-primary-500 bg-primary-500/15 text-white'
        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
    }`}
  >
    <div className="flex items-center gap-2 mb-1">
      <Icon className={`text-base ${current === value ? 'text-primary-400' : 'text-white/40'}`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <p className="text-xs text-white/40 leading-tight">{description}</p>
  </button>
);

export default function GeneratorOptions({ options, onChange }) {
  const { length, uppercase, lowercase, numbers, symbols, excludeSimilar, noRepeats, mode } = options;

  const set = (key) => (val) => onChange({ ...options, [key]: val });

  return (
    <div className="glass-card p-5 space-y-5">
      <h3 className="font-semibold text-white/90 flex items-center gap-2">
        <RiLockLine className="text-primary-400" />
        Generator Options
      </h3>

      {/* Length slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-white/80">Password Length</label>
          <span className="font-mono text-primary-400 font-bold text-lg w-10 text-center">{length}</span>
        </div>
        <input
          type="range"
          min={4}
          max={128}
          value={length}
          onChange={e => set('length')(Number(e.target.value))}
          className="w-full"
          aria-label="Password length"
          style={{
            background: `linear-gradient(to right, #5c7cfa ${((length - 4) / 124) * 100}%, rgba(255,255,255,0.1) ${((length - 4) / 124) * 100}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-white/30">
          <span>4</span><span>32</span><span>64</span><span>96</span><span>128</span>
        </div>
      </div>

      {/* Generation Mode */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/80">Generation Mode</p>
        <div className="grid grid-cols-2 gap-2">
          <ModeButton value="standard"   current={mode} onChange={set('mode')} label="Standard"      icon={RiLockLine}            description="Custom character options" />
          <ModeButton value="passphrase" current={mode} onChange={set('mode')} label="Passphrase"    icon={RiBookOpenLine}        description="Memorable word combo" />
          <ModeButton value="banking"    current={mode} onChange={set('mode')} label="Banking Grade" icon={RiSecurePaymentLine}   description="20+ chars, max security" />
          <ModeButton value="wifi"       current={mode} onChange={set('mode')} label="WiFi Password" icon={RiWifiLine}            description="Router-compatible symbols" />
        </div>
      </div>

      {/* Character options — standard mode only */}
      {mode === 'standard' && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/80">Character Types</p>
          <div className="space-y-2">
            <Toggle label="Uppercase Letters" description="A–Z"          icon={RiFontSize} checked={uppercase} onChange={set('uppercase')} />
            <Toggle label="Lowercase Letters" description="a–z"          icon={RiFontSize} checked={lowercase} onChange={set('lowercase')} />
            <Toggle label="Numbers"           description="0–9"          icon={RiHashtag}  checked={numbers}   onChange={set('numbers')} />
            <Toggle label="Symbols"           description="!@#$%^&*()"   icon={RiAtLine}   checked={symbols}   onChange={set('symbols')} />
          </div>
        </div>
      )}

      {/* Advanced options — standard mode only */}
      {mode === 'standard' && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/80">Advanced Options</p>
          <div className="space-y-2">
            <Toggle label="Exclude Similar Chars"     description="Removes i, l, 1, L, o, 0, O" icon={RiProhibitedLine} checked={excludeSimilar} onChange={set('excludeSimilar')} />
            <Toggle label="No Repeating Characters"   description="Each character used once"     icon={RiRepeatLine} checked={noRepeats}      onChange={set('noRepeats')} />
          </div>
        </div>
      )}
    </div>
  );
}
