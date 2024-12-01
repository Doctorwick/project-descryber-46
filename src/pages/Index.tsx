import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/5" />
        <div className="container max-w-6xl mx-auto text-center z-10">
          <span className="inline-block animate-fade-in-up px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/5 text-primary">
            Introducing Innovation
          </span>
          <h1 className="hero-text text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight tracking-tight">
            Design Meets Intelligence
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up delay-100">
            Experience the perfect blend of aesthetics and functionality, crafted with precision and care for the modern age.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-200">
            <Button size="lg" className="button-hover">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="button-hover">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-secondary/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/5 text-primary">
              Features
            </span>
            <h2 className="text-4xl font-bold mb-4">Crafted with Care</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every detail has been thoughtfully considered to deliver an exceptional experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Intuitive Design",
                description: "Clean interfaces that feel natural and effortless to use.",
              },
              {
                title: "Premium Quality",
                description: "Built with the highest standards of craftsmanship.",
              },
              {
                title: "Innovation First",
                description: "Pushing boundaries with cutting-edge technology.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-8 card-hover animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/5 text-primary">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold mb-4">Loved by Users</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what others are saying about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "The attention to detail is remarkable. Every interaction feels intentional and refined.",
                author: "Sarah Chen",
                role: "Product Designer",
              },
              {
                quote: "Finally, a product that prioritizes both form and function. It's a game-changer.",
                author: "Michael Park",
                role: "Creative Director",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-8 card-hover animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-lg mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="max-w-3xl mx-auto animate-on-scroll">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8 text-primary-foreground/80">
              Join us in shaping the future of digital experiences.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="button-hover bg-white text-primary hover:bg-white/90"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;