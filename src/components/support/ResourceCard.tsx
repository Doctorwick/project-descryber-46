import { motion } from "framer-motion";
import { ExternalLink, LifeBuoy, HelpCircle, MessageSquare, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ResourceCardProps {
  resource: {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
  };
}

export const ResourceCard = ({ resource }: ResourceCardProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "crisis":
        return <LifeBuoy className="h-5 w-5 text-red-500" />;
      case "mental":
        return <HelpCircle className="h-5 w-5 text-pink-500" />;
      case "communication":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="transition-all duration-200"
    >
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-md transition-shadow">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getCategoryIcon(resource.category)}
                <span className="text-sm text-gray-500 capitalize">
                  {resource.category}
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </div>
            <CardTitle className="text-base text-purple-700">
              {resource.name}
            </CardTitle>
            <CardDescription className="text-sm">
              {resource.description}
            </CardDescription>
          </CardHeader>
        </Card>
      </a>
    </motion.div>
  );
};