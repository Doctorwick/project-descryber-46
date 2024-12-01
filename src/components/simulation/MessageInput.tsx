import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isDisabled: boolean;
}

export const MessageInput = ({ input, setInput, handleSend, isDisabled }: MessageInputProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        placeholder={isDisabled ? "Simulation is paused..." : "Type a message..."}
        className="flex-1"
        disabled={isDisabled}
      />
      <Button 
        onClick={handleSend} 
        className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
        disabled={isDisabled}
      >
        Send
      </Button>
    </div>
  );
};