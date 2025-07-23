import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Staking - Earn Passive Income",
  description:
    "Stake your cryptocurrency and earn rewards while supporting blockchain networks.",
};

export default function StakingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Crypto Staking</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Put your crypto to work and earn rewards while contributing to
            network security.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-green-600">12%</h3>
            <p className="text-sm text-muted-foreground">Average APY</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-green-600">50+</h3>
            <p className="text-sm text-muted-foreground">Supported Assets</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-2xl font-bold text-green-600">24h</h3>
            <p className="text-sm text-muted-foreground">Reward Distribution</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">How Staking Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Choose Your Asset</h3>
                  <p className="text-muted-foreground text-sm">
                    Select from our range of proof-of-stake cryptocurrencies.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Delegate Your Tokens</h3>
                  <p className="text-muted-foreground text-sm">
                    Lock your tokens to participate in network validation.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Earn Rewards</h3>
                  <p className="text-muted-foreground text-sm">
                    Receive regular payouts based on network participation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Popular Staking Options</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <span className="font-medium">Ethereum (ETH)</span>
                    <p className="text-xs text-muted-foreground">
                      32 ETH minimum
                    </p>
                  </div>
                  <span className="text-green-600 font-medium">4.2% APY</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <span className="font-medium">Cardano (ADA)</span>
                    <p className="text-xs text-muted-foreground">No minimum</p>
                  </div>
                  <span className="text-green-600 font-medium">5.1% APY</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <span className="font-medium">Solana (SOL)</span>
                    <p className="text-xs text-muted-foreground">
                      0.01 SOL minimum
                    </p>
                  </div>
                  <span className="text-green-600 font-medium">7.3% APY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Flexible Staking
          </h3>
          <p className="text-green-700 text-sm">
            Start earning immediately with our flexible staking options. No
            lock-up periods, withdraw your funds anytime while still earning
            competitive rewards.
          </p>
        </div>
      </div>
    </div>
  );
}
