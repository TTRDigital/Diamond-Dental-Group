/** Black banner with the slowly drifting gold-tinted gradient (About, Patient Care, Services). */
export function DarkHero({ heading, text, textSpacing = "" }: { heading: string; text: string; textSpacing?: string }) {
  return (
    <section className="relative pt-24 pb-32 flex items-center justify-center text-center px-4 overflow-hidden bg-black text-white" data-anim>
      <div className="absolute inset-0 bg-gradient-drift bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#2a2000] opacity-80" />
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight md:leading-none drop-shadow-lg">{heading}</h1>
        <p className={`text-lg md:text-xl text-white/90 max-w-2xl font-medium ${textSpacing}`}>{text}</p>
      </div>
    </section>
  );
}
