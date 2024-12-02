import { Button } from "@/components/ui/button";
import { Shield, MessageSquare, Users, Database, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900 animate-fade-in">
          Welcome to <span className="text-purple-600">Descryber</span>
        </h1>
        <p className="mb-8 text-xl text-gray-600 max-w-2xl mx-auto">
          Your trusted guardian against cyberbullying, providing safety and support across <abbr title="Social Media Platforms">SMP</abbr>s.
        </p>
        <Link to="/simulation">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
            Try Demo
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How Descryber Protects You</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-purple-600" />}
            title="Smart Filtering"
            description={
              <>
                Automatically filters harmful messages and notifies you of potential threats while maintaining your privacy using <abbr title="Natural Language Processing">NLP</abbr>.
              </>
            }
          />
          <FeatureCard
            icon={<MessageSquare className="w-8 h-8 text-purple-600" />}
            title={<>
              <abbr title="Artificial Intelligence">AI</abbr>-Powered Detection
            </>}
            description="Advanced AI distinguishes between different types of harmful content to provide appropriate responses."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-purple-600" />}
            title="Support Network"
            description={
              <>
                Access to professional support services and <abbr title="Community-Based Organizations">CBO</abbr>s that understand what you're going through.
              </>
            }
          />
          <FeatureCard
            icon={<Database className="w-8 h-8 text-purple-600" />}
            title="Secure Backups"
            description={
              <>
                Safely store evidence of harassment with <abbr title="End-to-End Encryption">E2EE</abbr> that can't be deleted by others, giving you peace of mind.
              </>
            }
          />
          <FeatureCard
            icon={<Settings className="w-8 h-8 text-purple-600" />}
            title="User Control"
            description="Stay in control with smart override options while maintaining your safety."
          />
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-purple-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Why We Created Descryber</h2>
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <p className="text-gray-600 leading-relaxed">
              Inspired by Aaron's personal experience with cyberbullying at age 14, Descryber was born from the need to protect young people online. When Aaron received threatening messages including images of his house, he felt helpless when the evidence was deleted before <abbr title="Law Enforcement Agencies">LEA</abbr>s could act. This experience drove us to create a solution that ensures no one else has to go through the same ordeal.
            </p>
          </div>
        </div>
      </section>

      {/* Availability Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Coming Soon</h2>
        <p className="mb-8 text-xl text-gray-600 max-w-2xl mx-auto">
          Descryber will be available on both mobile and <abbr title="Personal Computer">PC</abbr> platforms, providing comprehensive protection wherever you are.
        </p>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: React.ReactNode; 
  description: React.ReactNode;
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}