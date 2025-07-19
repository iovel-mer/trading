import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Futures Trading - Leverage Your Market Position",
  description:
    "Trade futures contracts with up to 100x leverage on cryptocurrency, commodities, and indices.",
};

export default function FuturesTradingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Futures Trading</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Amplify your trading potential with leveraged futures contracts on
            global markets.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="text-amber-800 text-sm">
            <strong>Risk Warning:</strong> Futures trading involves substantial
            risk and may not be suitable for all investors. You could lose more
            than your initial investment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-primary">100x</h3>
            <p className="text-sm text-muted-foreground">Maximum Leverage</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-primary">24/7</h3>
            <p className="text-sm text-muted-foreground">Market Access</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-primary">0.02%</h3>
            <p className="text-sm text-muted-foreground">Maker Fee</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Contract Types</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-3">Perpetual Contracts</h3>
              <p className="text-muted-foreground mb-4">
                Trade without expiration dates. Perfect for long-term positions
                with funding rate adjustments.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• No expiry date</li>
                <li>• 8-hour funding cycles</li>
                <li>• Up to 100x leverage</li>
              </ul>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-3">Quarterly Futures</h3>
              <p className="text-muted-foreground mb-4">
                Traditional futures with fixed expiration dates. Ideal for
                hedging and speculation strategies.
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Fixed settlement dates</li>
                <li>• No funding fees</li>
                <li>• Institutional-grade contracts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Risk Management Tools</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">Stop Loss Orders</h3>
              <p className="text-sm text-muted-foreground">
                Automatically close positions to limit losses
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">Take Profit Orders</h3>
              <p className="text-sm text-muted-foreground">
                Lock in gains when targets are reached
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium">Position Limits</h3>
              <p className="text-sm text-muted-foreground">
                Set maximum exposure per contract
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
