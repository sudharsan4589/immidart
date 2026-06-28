interface FlagIconProps {
  /** ISO 3166-1 alpha-2 country code, e.g. "in", "us", "gb" */
  code: string;
  className?: string;
}

export function FlagIcon({ code, className = "" }: FlagIconProps) {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} rounded-sm ${className}`}
      role="img"
      aria-label={code.toUpperCase()}
    />
  );
}
