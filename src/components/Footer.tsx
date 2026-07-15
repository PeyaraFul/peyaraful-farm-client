import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-emerald-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">Peyaraful Farm</h3>
            <p className="text-sm text-gray-300">
              Premium cows and buffaloes from trusted Bangladeshi farms.
              Healthy livestock, fair prices.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link href="/all-cows" className="hover:text-gold transition-colors">All Cows</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Dhaka, Bangladesh</li>
              <li>+880 1XXXXXXXXX</li>
              <li>info@peyaraful.com</li>
            </ul>
          </div>
        </div>

        <hr className="border-emerald-bright mt-8 mb-6" />

        <p className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Peyaraful Farm. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
