import { Navbar } from "@/components/Navbar";
import { ResourceDirectory } from "@/components/support/ResourceDirectory";

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <ResourceDirectory />
      </div>
    </div>
  );
};

export default Support;