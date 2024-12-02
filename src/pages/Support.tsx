import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ExternalLink, Phone, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SupportResource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  priority: number;
}

const Support = () => {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["support-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_resources")
        .select("*")
        .eq("active", true)
        .order("priority", { ascending: false });
      
      if (error) throw error;
      return data as SupportResource[];
    },
  });

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "crisis":
        return <Phone className="h-5 w-5 text-red-500" />;
      case "mental health":
        return <Heart className="h-5 w-5 text-pink-500" />;
      default:
        return <ExternalLink className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Resources</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help. Below you'll find a list of trusted resources and support services available to assist you.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-32 bg-gray-200" />
                <CardContent className="h-24 bg-gray-100" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources?.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block transform transition-all duration-300 hover:-translate-y-1"
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(resource.category)}
                        <span className="text-sm font-medium text-gray-500 capitalize">
                          {resource.category}
                        </span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <CardTitle className="text-xl">{resource.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Support;