import { Activity, Calendar, CircleCheck, ClipboardList, Clock, Layers, MapPin, Shield, ShieldCheck, Smile, Sparkles, Star, Sun, Users, type LucideProps } from "lucide-react";
import type { IconName } from "@/lib/data/pages";

/** The live site's Lucide icons, chosen by name in /cms. */
const icons: Record<IconName, React.ComponentType<LucideProps>> = {
  star: Star,
  shield: Shield,
  shieldCheck: ShieldCheck,
  clock: Clock,
  mapPin: MapPin,
  circleCheck: CircleCheck,
  calendar: Calendar,
  clipboardList: ClipboardList,
  smile: Smile,
  layers: Layers,
  sparkles: Sparkles,
  sun: Sun,
  activity: Activity,
  users: Users,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = icons[name] ?? CircleCheck;
  return <C aria-hidden="true" {...props} />;
}

/** Five filled stars (rating rows). */
export function Stars({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <span className="flex text-secondary" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`${className} fill-current`} />
      ))}
    </span>
  );
}
