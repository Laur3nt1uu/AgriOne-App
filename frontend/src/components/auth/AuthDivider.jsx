export default function AuthDivider({ text = "sau" }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/50"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-card px-4 text-muted-foreground font-medium">
          {text}
        </span>
      </div>
    </div>
  );
}