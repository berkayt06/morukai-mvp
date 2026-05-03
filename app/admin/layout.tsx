import Background3D from "@/components/Background3D";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Background3D />
      {children}
    </div>
  );
}
