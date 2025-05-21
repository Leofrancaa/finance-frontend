import "./magicButton.css";

interface MagicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function MagicButton({ children, onClick }: MagicButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mt-4 magic-button relative inline-block w-32 h-11 leading-[2.5em] border-2 border-[#217BFF] text-[#217BFF] text-[17px] font-medium rounded-md transition-colors duration-500 overflow-hidden z-[1] cursor-pointer"
    >
      {children}
    </button>
  );
}
