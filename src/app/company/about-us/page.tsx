import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Leading Financial Technology Platform",
  description:
    "Learn about our mission to democratize financial markets through innovative trading technology.",
};

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're building the future of financial markets, making sophisticated
            trading tools accessible to everyone.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Financial markets have traditionally been the domain of large
              institutions and wealthy individuals. We believe that everyone
              deserves access to the same powerful trading tools and
              opportunities. Our platform combines institutional-grade
              technology with an intuitive interface, bringing professional
              trading capabilities to retail investors worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Founded in 2019</h3>
              <p className="text-muted-foreground">
                Started by a team of former Wall Street traders and Silicon
                Valley engineers who saw the need for better retail trading
                infrastructure. We've grown from a small startup to serving over
                2 million traders globally.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
              <p className="text-muted-foreground">
                With offices in New York, London, and Singapore, we provide 24/7
                support and maintain regulatory compliance across multiple
                jurisdictions. Our diverse team speaks over 20 languages.
              </p>
            </div>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Our Values</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Transparency</h4>
                <p className="text-sm text-muted-foreground">
                  Clear pricing, no hidden fees, open communication
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  Cutting-edge technology, continuous improvement
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Security</h4>
                <p className="text-sm text-muted-foreground">
                  Bank-grade security, regulatory compliance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
