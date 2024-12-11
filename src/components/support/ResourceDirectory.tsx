import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ResourceCard } from "./ResourceCard";
import { supabase } from "@/integrations/supabase/client";

type Resource = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  priority: number;
};

export const ResourceDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_resources")
        .select("*")
        .eq("active", true)
        .order("priority", { ascending: true });

      if (error) throw error;
      return data as Resource[];
    },
  });

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(resources.map((r) => r.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
          Support Resources
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find the help you need from our curated collection of support resources.
          If you're in immediate crisis, please reach out to emergency services.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm ${
              !selectedCategory
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm capitalize ${
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No resources found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};