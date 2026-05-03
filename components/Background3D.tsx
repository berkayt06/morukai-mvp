export default function Background3D() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-lime-50" />
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="orb animate-blob" style={{ width: 520, height: 520, background: "#86efac", top: -120, left: -120 }} />
      <div className="orb animate-blob" style={{ width: 420, height: 420, background: "#bef264", top: 200, right: -100, animationDelay: "-6s" }} />
      <div className="orb animate-blob" style={{ width: 380, height: 380, background: "#a7f3d0", bottom: -120, left: "30%", animationDelay: "-12s" }} />
    </div>
  );
}
