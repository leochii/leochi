const facebookHref = "https://www.facebook.com/";
const instagramHref = "https://www.instagram.com/";

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6.75H20V17.25H4V6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4.75 7.25L12 12.5L19.25 7.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 8.5H16.5V5.5H14C11.79 5.5 10 7.29 10 9.5V11.5H7.5V14.5H10V20.5H13V14.5H15.5L16 11.5H13V9.75C13 9.06 13.56 8.5 14.25 8.5H14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.75" y="4.75" width="14.5" height="14.5" rx="4.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 pt-[100px] pb-20 md:px-10 md:py-12">
        <div className="flex flex-col items-center gap-8 text-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6 md:text-left">
          <div className="max-w-md">
            <h2 className="text-2xl font-serif tracking-[0.08em] text-[#fff7ed] md:text-3xl">LEOCHI</h2>
            <p className="mt-4 text-[11px] uppercase tracking-[0.34em] text-[#d2bea0]">DESIGNED IN CANADA</p>
            <a href="mailto:support@leochi.co" className="mt-5 block text-sm text-[#efe3d3] transition hover:text-[#fff7ed]">
              support@leochi.co
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 md:justify-end">
            <a
              href={instagramHref}
              target="_blank"
              rel="noreferrer"
              aria-label="LEOCHI Instagram"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#efe3d3] transition duration-300 hover:border-[#E8D7C5] hover:bg-white/[0.06] hover:text-[#fff7ed]"
            >
              <InstagramIcon />
            </a>
            <a
              href={facebookHref}
              target="_blank"
              rel="noreferrer"
              aria-label="LEOCHI Facebook"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#efe3d3] transition duration-300 hover:border-[#E8D7C5] hover:bg-white/[0.06] hover:text-[#fff7ed]"
            >
              <FacebookIcon />
            </a>
            <a
              href="mailto:support@leochi.co"
              aria-label="Email LEOCHI"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#efe3d3] transition duration-300 hover:border-[#E8D7C5] hover:bg-white/[0.06] hover:text-[#fff7ed]"
            >
              <EmailIcon />
            </a>
          </div>

          <p className="text-center text-[11px] text-white/45 md:px-4">
            © 2026 LEOCHI. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}