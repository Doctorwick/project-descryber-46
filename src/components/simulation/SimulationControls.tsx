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
      className="flex gap-2"
    >
      {!isActive ? (
        <Button 
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-sm 
            hover:shadow-md gap-2"
        >
          <Play className="w-4 h-4" />
          Start
        </Button>
      ) : (
        <>
          <Button 
            onClick={onPause}
            className={`transition-all duration-300 shadow-sm hover:shadow-md gap-2 ${
              isPaused 
                ? 'bg-yellow-600 hover:bg-yellow-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Pause className="w-4 h-4" />
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button 
            onClick={onStop}
            className="bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-sm 
              hover:shadow-md gap-2"
          >
            <StopCircle className="w-4 h-4" />
            Stop
          </Button>
        </>
      )}
    </motion.div>
  );
};