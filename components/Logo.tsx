export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="9" fill="#122019" />
      <rect width="32" height="32" rx="9" stroke="#243D33" />
      <path
        d="M9 12.5L13 16.5L9 20.5"
        stroke="#33E17F"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 20.5H23"
        stroke="#8CF0B6"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
