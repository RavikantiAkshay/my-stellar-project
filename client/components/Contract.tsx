"use client";

import { useState, useCallback, useEffect } from "react";
import {
  createPool,
  placeBet,
  getPoolStatus,
  CONTRACT_ADDRESS,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function PoolIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 12a4 4 0 0 1-8 0" />
    </svg>
  );
}

function BetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Method Signature ─────────────────────────────────────────

function MethodSignature({
  name,
  params,
  returns,
  color,
}: {
  name: string;
  params: string;
  returns?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-mono text-sm">
      <span style={{ color }} className="font-semibold">fn</span>
      <span className="text-white/70">{name}</span>
      <span className="text-white/20 text-xs">{params}</span>
      {returns && (
        <span className="ml-auto text-white/15 text-[10px]">{returns}</span>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

type Tab = "status" | "create" | "join";

interface PoolStatus {
  total_bet_amount: bigint;
  ticket_price: bigint;
  participants_count: bigint;
  is_closed: boolean;
}

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("status");
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const [poolDesc, setPoolDesc] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [isJoining, setIsJoining] = useState(false);

  const [poolData, setPoolData] = useState<PoolStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const fetchStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const status = await getPoolStatus(walletAddress || undefined);
      if (status) {
        setPoolData(status as unknown as PoolStatus);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch status", err);
    } finally {
      setIsLoadingStatus(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleCreatePool = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!poolDesc.trim() || !ticketPrice.trim()) return setError("Fill in all fields");
    setError(null);
    setIsCreating(true);
    setTxStatus("Awaiting signature...");
    try {
      await createPool(walletAddress, poolDesc.trim(), BigInt(ticketPrice));
      setTxStatus("Pool created successfully!");
      setPoolDesc("");
      setTicketPrice("");
      fetchStatus();
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Account not found")) {
        setError("Account not found on Testnet. You need to fund it first!");
      } else {
        setError(msg);
      }
      setTxStatus(null);
    } finally {
      setIsCreating(false);
    }
  }, [walletAddress, poolDesc, ticketPrice, fetchStatus]);

  const handlePlaceBet = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    setError(null);
    setIsJoining(true);
    setTxStatus("Awaiting signature...");
    try {
      await placeBet(walletAddress, walletAddress);
      setTxStatus("Bet placed successfully!");
      fetchStatus();
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Account not found")) {
        setError("Account not found on Testnet. You need to fund it first!");
      } else {
        setError(msg);
      }
      setTxStatus(null);
    } finally {
      setIsJoining(false);
    }
  }, [walletAddress, fetchStatus]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "status", label: "Pool Status", icon: <ChartIcon />, color: "#4fc3f7" },
    { key: "create", label: "Create Pool", icon: <PoolIcon />, color: "#7c6cf0" },
    { key: "join", label: "Join Pool", icon: <BetIcon />, color: "#34d399" },
  ];

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
            {error.includes("Account not found") && (
              <a 
                href={`https://laboratory.stellar.org/#account-creator?network=testnet&publicKey=${walletAddress}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-[#4fc3f7] hover:underline"
              >
                Fund with Friendbot →
              </a>
            )}
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("successfully") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#4fc3f7]/20 border border-white/[0.06]">
                <PoolIcon />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Betting Pool Contract</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant={poolData?.is_closed ? "warning" : "success"} className="text-[10px]">
              {poolData?.is_closed ? "Closed" : "Active"}
            </Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all"
                    style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Status */}
            {activeTab === "status" && (
              <div className="space-y-5">
                <MethodSignature name="view_pool_status" params="()" returns="-> PoolStatus" color="#4fc3f7" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Total Pool</p>
                    <p className="text-2xl font-bold text-white/90 font-mono">
                      {poolData ? (Number(poolData.total_bet_amount) / 10000000).toFixed(2) : "0.00"} XLM
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Participants</p>
                    <p className="text-2xl font-bold text-white/90 font-mono">
                      {poolData ? Number(poolData.participants_count) : "0"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Ticket Price</p>
                    <p className="text-xl font-bold text-white/70 font-mono">
                      {poolData ? (Number(poolData.ticket_price) / 10000000).toFixed(2) : "0.00"} XLM
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Status</p>
                    <p className={cn(
                      "text-xl font-bold font-mono",
                      poolData?.is_closed ? "text-[#fbbf24]" : "text-[#34d399]"
                    )}>
                      {poolData?.is_closed ? "LOCKED" : "OPEN"}
                    </p>
                  </div>
                </div>

                <ShimmerButton onClick={fetchStatus} disabled={isLoadingStatus} shimmerColor="#4fc3f7" className="w-full">
                  {isLoadingStatus ? <><SpinnerIcon /> Updating...</> : <><ChartIcon /> Refresh Stats</>}
                </ShimmerButton>
              </div>
            )}

            {/* Create */}
            {activeTab === "create" && (
              <div className="space-y-5">
                <MethodSignature name="create_pool" params="(description: String, ticket_price: u128)" color="#7c6cf0" />
                <Input label="Pool Description" value={poolDesc} onChange={(e) => setPoolDesc(e.target.value)} placeholder="e.g. World Cup Finals Winner" />
                <Input label="Ticket Price (Stroops)" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} placeholder="e.g. 10000000 (1 XLM)" />
                {walletAddress ? (
                  <ShimmerButton onClick={handleCreatePool} disabled={isCreating} shimmerColor="#7c6cf0" className="w-full">
                    {isCreating ? <><SpinnerIcon /> Initializing...</> : <><PoolIcon /> Initialize Pool</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.03] py-4 text-sm text-[#7c6cf0]/60 hover:border-[#7c6cf0]/30 hover:text-[#7c6cf0]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to create pool
                  </button>
                )}
              </div>
            )}

            {/* Join */}
            {activeTab === "join" && (
              <div className="space-y-5">
                <MethodSignature name="place_bet" params="(participant: Address)" color="#34d399" />
                <div className="rounded-xl border border-white/10 bg-[#34d399]/[0.03] p-6 text-center">
                  <p className="text-sm text-white/50 mb-4">
                    Ready to join the pool? The ticket price is fixed at 
                    <span className="text-white/90 font-mono ml-1">
                      {poolData ? (Number(poolData.ticket_price) / 10000000).toFixed(2) : "0.00"} XLM
                    </span>.
                  </p>
                  {walletAddress ? (
                    <ShimmerButton onClick={handlePlaceBet} disabled={isJoining || poolData?.is_closed} shimmerColor="#34d399" className="w-full">
                      {isJoining ? <><SpinnerIcon /> Joining...</> : <><BetIcon /> Place My Bet</>}
                    </ShimmerButton>
                  ) : (
                    <button
                      onClick={onConnect}
                      disabled={isConnecting}
                      className="w-full rounded-xl border border-dashed border-[#34d399]/20 bg-[#34d399]/[0.03] py-4 text-sm text-[#34d399]/60 hover:border-[#34d399]/30 hover:text-[#34d399]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                    >
                      Connect wallet to join pool
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Betting Pool &middot; Soroban Smart Contract</p>
            <div className="flex items-center gap-4 text-[10px] text-white/10">
              <span>Testnet</span>
              <span>Fixed Odds</span>
              <span>Fully Auditable</span>
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}
