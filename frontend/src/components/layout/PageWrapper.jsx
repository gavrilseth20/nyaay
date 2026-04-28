import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function PageWrapper({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <div className="aurora flex min-h-screen">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
      <main className="min-w-0 flex-1">
        <Topbar onMobileMenu={() => setMobileNavOpen(true)} />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1400px] p-4 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
