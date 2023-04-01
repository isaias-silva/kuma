import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AnimatePresence, motion } from "framer-motion";

export default function App({ Component, pageProps, router }: AppProps) {
  return <AnimatePresence >
    <motion.div
      key={router.route}
      initial={{ opacity:1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Component {...pageProps} />
    </motion.div>
  </AnimatePresence>
}
