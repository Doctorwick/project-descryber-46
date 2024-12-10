import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto"
    >
      {!isActive ? (
        <Button 
          onClick={onStart}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
            transition-all duration-300 shadow-lg hover:shadow-xl gap-2 h-10 sm:h-11 px-4 sm:px-6 
            text-sm sm:text-base font-medium w-full sm:w-auto"
        >
          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
          Start Simulation
        </Button>
      ) : (
        <>
          <Button 
            onClick={onPause}
            className={`transition-all duration-300 shadow-lg hover:shadow-xl gap-2 h-10 sm:h-11 
              px-4 sm:px-6 text-sm sm:text-base font-medium w-full sm:w-auto ${
              isPaused 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            }`}
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button 
            onClick={onStop}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
              transition-all duration-300 shadow-lg hover:shadow-xl gap-2 h-10 sm:h-11 px-4 sm:px-6 
              text-sm sm:text-base font-medium w-full sm:w-auto"
          >
            <StopCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            Stop
          </Button>
        </>
      )}
    </motion.div>
  );
};