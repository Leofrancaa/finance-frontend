interface EditButtonProps {
  onClick: () => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Editar item"
      className="group p-2 bg-transparent border-none cursor-pointer transition-transform duration-200 ease-in-out"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 text-blue-500 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] group-hover:rotate-[-15deg] group-hover:scale-110 group-active:rotate-[-5deg] group-active:scale-95"
      >
        <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25z" />
        <path
          d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
          className="fill-blue-700"
        />
      </svg>
    </button>
  );
}
