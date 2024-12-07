import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SimulationControlsProps {
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

export const SimulationControls = ({
  isActive,
  isPaused,
  onStart,
  onPause,
  onStop
}: SimulationControlsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3"
    >
      {!isActive ? (
        <Button 
          onClick={onStart}
          className="bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-lg 
            hover:shadow-xl gap-2 h-11 px-6 text-base font-medium"
        >
          <Play className="w-5 h-5" />
          Start Simulation
        </Button>
      ) : (
        <>
          <Button 
            onClick={onPause}
            className={`transition-all duration-300 shadow-lg hover:shadow-xl gap-2 h-11 px-6 
              text-base font-medium ${
              isPaused 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <Pause className="w-5 h-5" />
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button 
            onClick={onStop}
            className="bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-lg 
              hover:shadow-xl gap-2 h-11 px-6 text-base font-medium"
          >
            <StopCircle className="w-5 h-5" />
            Stop
          </Button>
        </>
      )}
    </motion.div>
  );
};