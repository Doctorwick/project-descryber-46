import { Button } from "@/components/ui/button";
import { Play, Pause, StopCircle } from "lucide-react";

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
    <div className="flex gap-2">
      {!isActive ? (
        <Button 
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700"
        >
          <Play className="w-4 h-4 mr-2" />
          Start
        </Button>
      ) : (
        <>
          <Button 
            onClick={onPause}
            className={`${isPaused ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <Pause className="w-4 h-4 mr-2" />
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button 
            onClick={onStop}
            className="bg-red-600 hover:bg-red-700"
          >
            <StopCircle className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </>
      )}
    </div>
  );
};