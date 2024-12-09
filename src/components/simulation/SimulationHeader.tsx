import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export const SimulationHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-3 bg-purple-100 rounded-xl">
          <Shield className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
            from-purple-600 to-purple-800">
            Message Filter Demo
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Test our AI-powered content filtering system
          </p>
        </div>
      </motion.div>
    </div>
  );
};