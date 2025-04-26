import { motion } from "motion/react"

export default function AnimatedVisibility({
  children,
  isVisible,
}: {
  children: React.ReactNode
  isVisible: boolean
}) {
  return (
    <motion.div
      animate={{
        height: isVisible ? "auto" : 0,
      }}
      initial={{ height: 0 }}
      transition={{
        type: "spring",
        bounce: 0.2,
        duration: 0.5,
      }}
      style={{
        overflow: "hidden",
      }}
    >
      {children}
    </motion.div>
  )
}
