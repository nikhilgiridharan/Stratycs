import { BottomNav } from "@/components/layout/BottomNav";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="mx-auto max-w-3xl px-4 pt-4 md:px-8 md:pt-8">{children}</div>
      <BottomNav />
    </div>
  );
}
