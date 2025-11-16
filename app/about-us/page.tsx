import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Award, Heart } from "lucide-react";

export const metadata = {
  title: "About Us | E-Commerce Store",
  description: "Learn more about our company, mission, and values",
};

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              About Our Company
            </h1>
            <p className="text-lg text-muted-foreground">
              We're passionate about delivering exceptional products and creating memorable shopping experiences for our customers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Our Story */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Story</CardTitle>
                <CardDescription>How it all began</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, our e-commerce platform started with a simple mission: to make quality products accessible to everyone. 
                  What began as a small online store has grown into a trusted destination for thousands of customers worldwide.
                </p>
                <p>
                  We believe that shopping should be easy, enjoyable, and reliable. That's why we've built our platform with customer 
                  satisfaction at its core, offering a wide selection of products, competitive prices, and exceptional service.
                </p>
                <p>
                  Today, we continue to innovate and expand our offerings, always staying true to our founding principles of quality, 
                  integrity, and customer-first service.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Heart className="h-6 w-6 text-primary" />
                      <CardTitle>Customer First</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our customers are at the heart of everything we do. We listen, learn, and continuously improve to exceed expectations.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="h-6 w-6 text-primary" />
                      <CardTitle>Quality Assurance</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We carefully curate every product in our catalog, ensuring only the highest quality items reach our customers.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-6 w-6 text-primary" />
                      <CardTitle>Excellence</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We strive for excellence in every aspect of our business, from product selection to customer service.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-6 w-6 text-primary" />
                      <CardTitle>Community</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We're building more than a store—we're creating a community of satisfied customers who trust us with their needs.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mission */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
                <CardDescription>What drives us forward</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">
                  To provide exceptional products and services that enhance our customers' lives while maintaining the highest standards 
                  of quality, integrity, and customer satisfaction. We aim to be the most trusted and preferred e-commerce destination 
                  for customers worldwide.
                </p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;

