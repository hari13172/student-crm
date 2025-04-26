"use client"

import { Frown, MoveLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
      <div className="max-w-lg w-full space-y-8 text-center">
        <motion.div
          className="relative flex justify-center items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-extrabold tracking-widest flex items-center">
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ times: [0, 0.5, 1], duration: 0.8 }}
            >
              4
            </motion.span>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 2,
                ease: "easeInOut",
              }}
              className="mx-4"
            >
              <Frown className="text-primary w-32 h-32 opacity-80" />
            </motion.div>
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ times: [0, 0.5, 1], duration: 0.8, delay: 0.2 }}
            >
              4
            </motion.span>
          </h1>
        </motion.div>

        <motion.div
          className="tracking-widest mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span className="text-foreground text-6xl block font-bold mb-4">
            <span>Oops!</span>
          </span>
          <p className="text-muted-foreground text-xl max-w-md mx-auto">
            The page you're looking for seems to have wandered off. Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link to="/" className="inline-block">
            <Button size="lg" className="gap-2 px-6 py-6 text-lg group">
              <MoveLeft className="mr-1 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Homepage</span>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.5 }}
          transition={{ delay: 1, duration: 1 }}
        />
      </div>
    </div>
  )
}
