import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'motion/react'

/**
 * Número que anima de su valor anterior al nuevo con un spring, en vez de
 * saltar de golpe cada vez que el WIP simulado se refresca.
 */
export default function AnimatedNumber({ value, className }) {
  const spring = useSpring(0, { stiffness: 120, damping: 20, mass: 1 })
  const rounded = useTransform(spring, (latest) => Math.round(latest).toLocaleString())

  useEffect(() => {
    spring.set(Number(value) || 0)
  }, [value, spring])

  return <motion.span className={className}>{rounded}</motion.span>
}
