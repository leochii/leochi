export default function SiteFooter() {
  return (
    <footer className="bg-black text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <h2 className="mb-4 text-2xl font-serif">LEOCHI</h2>

            <p className="text-gray-300">DESIGN IN CANADA</p>

            <p className="mt-6 text-gray-400">support@leochi.co</p>
          </div>

          <div>
            <h3 className="mb-5 text-sm uppercase tracking-[0.2em]">Shop</h3>

            <ul className="space-y-3 text-gray-300">
              <li>Chem-Trail</li>
              <li>Farsh</li>
              <li>Leochi</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm uppercase tracking-[0.2em]">Info</h3>

            <ul className="space-y-3 text-gray-300">
              <li>Custom Printing</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm uppercase tracking-[0.2em]">Follow</h3>

            <ul className="space-y-3 text-gray-300">
              <li>Instagram</li>
              <li>Facebook</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-neutral-800 pt-8 text-center text-sm text-gray-400">
          © 2026 LEOCHI. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}