import Link from "next/link";

type CollectionCardProps = {
  title: string;
  seasonLabel: string;
  description: string;
  available: boolean;
  href?: string;
  itemCount?: string;
};

export default function CollectionCard({
  title,
  seasonLabel,
  description,
  available,
  href,
  itemCount,
}: CollectionCardProps) {
  const baseClass =
    "group relative block aspect-[4/5] overflow-hidden rounded-[2px] border border-white/10 bg-neutral-950";

  const content = (
    <>
      <div
        className={`absolute inset-0 ${
          available
            ? "bg-[radial-gradient(circle_at_70%_30%,rgba(198,160,112,0.22)_0%,rgba(20,20,24,0.65)_48%,rgba(8,8,10,0.92)_100%)]"
            : "bg-[radial-gradient(circle_at_62%_24%,rgba(164,132,91,0.2)_0%,rgba(18,18,22,0.78)_52%,rgba(8,8,10,0.95)_100%)]"
        } ${available ? "group-hover:scale-[1.03]" : "group-hover:scale-[1.02]"} transition-transform duration-700`}
      />

      {!available ? (
        <div className="absolute inset-0 scale-105 bg-[linear-gradient(125deg,rgba(255,255,255,0.05)_0%,transparent_40%,rgba(255,255,255,0.04)_100%)] blur-[2px]" />
      ) : null}

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex h-full flex-col justify-between p-7 md:p-9">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">{seasonLabel}</p>
          <h3 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl">{title}</h3>
        </div>

        <div className={`${available ? "text-left" : "text-center"}`}>
          {available ? (
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/80">{itemCount}</p>
          ) : (
            <>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/85">COMING SOON</p>
              <p className="mt-3 text-sm text-white/70">Inspired by Persian Seasons.</p>
            </>
          )}

          <p className={`mt-4 text-sm text-white/75 ${available ? "" : "text-white/70"}`}>{description}</p>
        </div>
      </div>
    </>
  );

  if (available && href) {
    return (
      <Link href={href} className={`${baseClass} cursor-pointer`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`${baseClass} cursor-default`}>
      {content}
    </div>
  );
}