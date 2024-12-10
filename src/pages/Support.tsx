import { Navbar } from "@/components/Navbar";
import { SupportChat } from "@/components/support/SupportChat";
import { motion } from "framer-motion";

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
            How Can We Help?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Share what's troubling you, and we'll connect you with the right resources and support.
          </p>
        </motion.div>

        <SupportChat />
      </div>
    </div>
  );
};

export default Support;