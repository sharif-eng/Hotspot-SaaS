interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function Toggle({ enabled, onChange, size = 'md' }: ToggleProps) {
  const sizes = {
    sm: 'h-4 w-7',
    md: 'h-6 w-11',
    lg: 'h-8 w-14'
  };

  const thumbSizes = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-7 w-7'
  };

  const translateX = {
    sm: enabled ? 'translate-x-3' : 'translate-x-0',
    md: enabled ? 'translate-x-5' : 'translate-x-0',
    lg: enabled ? 'translate-x-6' : 'translate-x-0'
  };

  return (
    <button
      type="button"
      className={`${sizes[size]} ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`${thumbSizes[size]} ${translateX[size]} pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
}