import { ArrowUpRight } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Badge from "../ui/Badge";

export default function AuditCard({ audit }) {
  return (
    <GlassCard className="p-4" interactive>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-ink-primary truncate">{audit.model}</div>
          <div className="mt-0.5 text-xs text-ink-muted mono">{audit.type} · {audit.date}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{audit.severity}</Badge>
          <ArrowUpRight className="h-4 w-4 text-ink-muted" />
        </div>
      </div>
    </GlassCard>
  );
}
