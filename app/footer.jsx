
import {
  FaTiktok,
  FaInstagram,
  FaFacebook,
  FaSnapchatGhost,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const footer = () => {
  return (
    <div>
         <footer className="bg-black text-white rounded-3xl h-[85vh] mt-10 m-5 w-full flex flex-col justify-between p-10">
          {/* Top 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
            <div>
              <h3 className="text-lg font-semibold mb-4">Find a boutique</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-gray-300">
                  Parfums Christian Dior Boutiques
                </li>
                <li className="hover:text-gray-300">
                  Christian Dior Couture Boutiques
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Client Services</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-gray-300">Contact us</li>
                <li className="hover:text-gray-300">Delivery & Returns</li>
                <li className="hover:text-gray-300">FAQ</li>
                <li className="hover:text-gray-300">Receive My Invoice</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Maison Dior</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-gray-300">Dior Sustainability</li>
                <li className="hover:text-gray-300">Ethics & Compliance</li>
                <li className="hover:text-gray-300">Careers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-gray-300">Legal Terms</li>
                <li className="hover:text-gray-300">Privacy Policy</li>
                <li className="hover:text-gray-300">Sales Conditions</li>
                <li className="hover:text-gray-300">Cookie Management</li>
                <li className="hover:text-gray-300">Sitemap</li>
              </ul>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between text-sm space-y-6 md:space-y-0">
            <div className="flex space-x-6 text-xl">
              <a href="#">
                <FaTiktok className="hover:text-gray-300 hover:scale-125 transition" />
              </a>
              <a href="#">
                <FaInstagram className="hover:text-gray-300 hover:scale-125 transition" />
              </a>
              <a href="#">
                <FaXTwitter className="hover:text-gray-300 hover:scale-125 transition" />
              </a>
              <a href="#">
                <FaFacebook className="hover:text-gray-300 hover:scale-125 transition" />
              </a>
              <a href="#">
                <FaSnapchatGhost className="hover:text-gray-300 hover:scale-125 transition" />
              </a>
            </div>
            <div className="font-serif text-2xl tracking-widest">DIOR</div>
            <div className="hover:text-gray-300 cursor-pointer">
              United Kingdom (English)
            </div>
          </div>
        </footer>
    </div>
  )
}

export default footer