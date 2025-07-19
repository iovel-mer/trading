import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Options Trading - Strategic Market Positions",
  description:
    "Trade call and put options with flexible strategies for hedging and speculation.",
};

export default function OptionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Options Trading</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sophisticated trading strategies with defined risk and unlimited
            potential upside.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Call Options</h3>
            <p className="text-muted-foreground mb-4">
              Profit from upward price movements with limited downside risk. Pay
              only the premium to control large positions.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Maximum Loss:</span>
                <span className="font-medium">Premium Paid</span>
              </div>
              <div className="flex justify-between">
                <span>Maximum Profit:</span>
                <span className="font-medium">Unlimited</span>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Put Options</h3>
            <p className="text-muted-foreground mb-4">
              Benefit from declining markets or hedge existing positions with
              defined risk parameters.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Maximum Loss:</span>
                <span className="font-medium">Premium Paid</span>
              </div>
              <div className="flex justify-between">
                <span>Maximum Profit:</span>
                <span className="font-medium">Strike - Premium</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Popular Strategies</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-primary bg-muted/50">
              <h3 className="font-medium">Covered Call</h3>
              <p className="text-sm text-muted-foreground">
                Generate income from existing stock positions while maintaining
                upside exposure.
              </p>
            </div>
            <div className="p-4 border-l-4 border-primary bg-muted/50">
              <h3 className="font-medium">Protective Put</h3>
              <p className="text-sm text-muted-foreground">
                Insurance for your portfolio against significant downside moves.
              </p>
            </div>
            <div className="p-4 border-l-4 border-primary bg-muted/50">
              <h3 className="font-medium">Iron Condor</h3>
              <p className="text-sm text-muted-foreground">
                Profit from low volatility with limited risk and defined profit
                potential.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-black">
            Options Education
          </h3>
          <p className="text-blue-800 text-sm">
            New to options? Our comprehensive education center covers everything
            from basic concepts to advanced strategies. Start with paper trading
            to practice without risk.
          </p>
        </div>
      </div>
    </div>
  );
}
