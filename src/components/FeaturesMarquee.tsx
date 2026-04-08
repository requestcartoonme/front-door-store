import { FEATURES_MARQUEE } from '@/lib/constants';

export function FeaturesMarquee() {
  return (
    <div className="bg-secondary/10 border-y border-border py-3 sm:py-4 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...FEATURES_MARQUEE, ...FEATURES_MARQUEE].map((feature, i) => (
          <span key={i} className="mx-6 sm:mx-8 text-xs sm:text-sm font-medium text-secondary-foreground/80 font-body flex items-center gap-4 sm:gap-6">
            {feature}
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
