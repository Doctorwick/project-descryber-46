import { CircuitBoard, Brain } from "lucide-react";
import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <motion.div 
      className="relative w-10 h-10"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CircuitBoard className="w-full h-full text-purple-600" />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Brain className="w-6 h-6 text-purple-800" />
      </motion.div>
    </motion.div>
  );
};