import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen gradient-cream flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <span className="text-3xl">🧁</span>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-primary text-xl tracking-tight">
            Cupcake
          </span>
          <span className="text-xs text-muted-foreground font-medium -mt-0.5">
            Gourmet
          </span>
        </div>
      </Link>
      {children}
    </div>
  );
}
