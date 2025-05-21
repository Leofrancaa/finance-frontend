interface PlusButtonProps {
  onClick?: () => void;
}

export default function PlusButton({ onClick }: PlusButtonProps) {
  return (
    <button
      onClick={onClick}
      title="Add New"
      className="rounded-md mt-7 cursor-pointer group w-10 h-10 border-2 border-[#217BFF] bg-white flex items-center justify-center hover:rotate-90 duration-300 outline-none focus-visible:ring-2 focus-visible:ring-teal-300 active:scale-95"
    >
      <svg
        className="stroke-[#217BFF] fill-none group-hover:fill-[#217BFF] group-active:stroke-[#217BFF] group-active:fill-[#217BFF] group-active:duration-0 duration-300"
        viewBox="0 0 24 24"
        width="26"
        height="26"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="12" x2="12" y1="5" y2="19" strokeWidth="1.5" />
        <line x1="5" x2="19" y1="12" y2="12" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
