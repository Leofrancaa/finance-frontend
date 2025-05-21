import "./fancyButton.css"; // importa o CSS customizado

interface FancyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function FancyButton({ children, onClick }: FancyButtonProps) {
  return (
    <button onClick={onClick} className="fancy-button">
      {children}
      <span className="fancy-span"></span>
    </button>
  );
}
