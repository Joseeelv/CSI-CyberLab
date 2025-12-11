'use client';

export function BackgroundGradient() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
