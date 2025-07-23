import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spot Trading - Trade Real-Time Markets",
  description:
    "Execute instant trades on cryptocurrency and traditional assets with competitive spreads and deep liquidity.",
};

export default function SpotTradingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Spot Trading</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trade assets at current market prices with instant settlement and
            full ownership of your positions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Why Choose Spot Trading?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium">Immediate Ownership</h3>
                  <p className="text-muted-foreground">
                    Own your assets outright with no expiration dates or complex
                    derivatives.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium">Transparent Pricing</h3>
                  <p className="text-muted-foreground">
                    See real-time market prices with no hidden fees or markup on
                    spreads.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium">Deep Liquidity</h3>
                  <p className="text-muted-foreground">
                    Execute large orders without significant price impact
                    through our liquidity network.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Available Markets</h2>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Cryptocurrency Pairs</h3>
                <p className="text-sm text-muted-foreground">
                  BTC, ETH, and 200+ digital assets
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Forex Majors</h3>
                <p className="text-sm text-muted-foreground">
                  EUR/USD, GBP/USD, USD/JPY and more
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Commodities</h3>
                <p className="text-sm text-muted-foreground">
                  Gold, Silver, Oil, and Agricultural products
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
          <p className="text-muted-foreground">
            Ready to start spot trading? Fund your account and begin trading
            with as little as $10. Our intuitive platform makes it easy to place
            orders, track positions, and manage your portfolio.
          </p>
        </div>
      </div>
    </div>
  );
}
