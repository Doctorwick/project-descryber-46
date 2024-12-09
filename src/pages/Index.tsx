import { Button } from "@/components/ui/button";
import { Shield, MessageSquare, Users, Database, Settings, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,135,245,0.1),transparent_50%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h1 className="mb-6 text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
            Welcome to Descryber
          </h1>
          <p className="mb-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your trusted guardian against cyberbullying, providing safety and support 
            across social media platforms with advanced AI protection.
          </p>
          <Link to="/simulation">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
                text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                group relative overflow-hidden"
            >
              <span className="relative z-10">Try Demo</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-purple-800 
          bg-clip-text text-transparent">
          How Descryber Protects You
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-purple-600" />}
            title="Smart Filtering"
            description="Automatically filters harmful messages using advanced natural language processing while maintaining your privacy."
            delay={0.1}
          />
          <FeatureCard
            icon={<MessageSquare className="w-8 h-8 text-purple-600" />}
            title="AI-Powered Detection"
            description="Advanced AI distinguishes between different types of harmful content to provide appropriate responses."
            delay={0.2}
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-purple-600" />}
            title="Support Network"
            description="Access to professional support services and community organizations that understand what you're going through."
            delay={0.3}
          />
          <FeatureCard
            icon={<Database className="w-8 h-8 text-purple-600" />}
            title="Secure Backups"
            description="Safely store evidence of harassment with end-to-end encryption that can't be deleted by others."
            delay={0.4}
          />
          <FeatureCard
            icon={<Settings className="w-8 h-8 text-purple-600" />}
            title="User Control"
            description="Stay in control with smart override options while maintaining your safety."
            delay={0.5}
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-white/50" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-purple-800 
              bg-clip-text text-transparent">
              Why We Created Descryber
            </h2>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-purple-100">
              <p className="text-gray-600 leading-relaxed">
                Inspired by Aaron's personal experience with cyberbullying at age 14, 
                Descryber was born from the need to protect young people online. When 
                Aaron received threatening messages including images of his house, he 
                felt helpless when the evidence was deleted before law enforcement 
                could act. This experience drove us to create a solution that ensures 
                no one else has to go through the same ordeal.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Availability Section */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(155,135,245,0.1),transparent_50%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-purple-800 
            bg-clip-text text-transparent">
            Coming Soon
          </h2>
          <p className="mb-8 text-xl text-gray-600 max-w-2xl mx-auto">
            Descryber will be available on both mobile and personal computer platforms, 
            providing comprehensive protection wherever you are.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all 
        duration-300 hover:-translate-y-1 border border-purple-100 group"
    >
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-purple-800 
        bg-clip-text text-transparent">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}