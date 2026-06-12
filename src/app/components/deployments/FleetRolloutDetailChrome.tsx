import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  SmallText,
  TinyText,
  SecondaryButton,
  LinkButton,
} from "../../../imports/UIComponents";
import { deploymentCopy } from "./deploymentPrototypeCopy";
import { prototypeInteractionToastClassNames } from "./prototypeChrome";
import type { FleetRolloutDetail } from "./fleetRolloutDemoData";

function StartedByContent({ detail }: { detail: FleetRolloutDetail }) {
  const externalLabel =
    detail.openExternalLabel ??
    (detail.externalRef
      ? deploymentCopy.fleetRolloutDetail.openInExternal(detail.externalRef.system)
      : undefined);
  const [relativeTime, setRelativeTime] = useState(
    detail.freshness.relativeTime,
  );

  const handleRefresh = () => {
    setRelativeTime(deploymentCopy.fleetRolloutDetail.freshnessJustNow);
    toast(deploymentCopy.fleetRolloutDetail.refreshPrototypeToast, {
      classNames: prototypeInteractionToastClassNames,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <TinyText muted className="!inline text-[11px]">
            {deploymentCopy.fleetRolloutDetail.startedBy}{" "}
          </TinyText>
          <SmallText
            className="!inline text-sm"
            style={{ fontWeight: "var(--font-weight-medium)" }}
          >
            {detail.startedByLabel}
          </SmallText>
          {detail.externalRef ? (
            <TinyText muted className="!mt-0.5 !block text-[11px] leading-snug">
              {detail.externalRef.label}
            </TinyText>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-center">
          <SecondaryButton
            type="button"
            className="!py-1.5 !text-xs"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-1.5 size-3.5" aria-hidden />
            {detail.freshness.refreshLabel}
          </SecondaryButton>
          {detail.externalRef?.href && externalLabel ? (
            <LinkButton
              type="button"
              className="text-sm"
              onClick={() => {
                /* prototype — no external navigation */
              }}
            >
              {externalLabel}
            </LinkButton>
          ) : null}
        </div>
      </div>
      <TinyText muted className="!block text-[11px] leading-snug">
        {detail.freshness.caption} · {relativeTime}
      </TinyText>
    </div>
  );
}

/** Started-by, freshness, and external link in one subtle summary card. */
export function FleetRolloutSummarySection({
  detail,
  compact = false,
}: {
  detail: FleetRolloutDetail;
  /** Tighter padding on failed drilldown so timeline stays primary. */
  compact?: boolean;
}) {
  return (
    <section
      className={
        compact
          ? "mb-4 rounded-md border px-3 py-2.5"
          : "mb-5 rounded-md border p-4"
      }
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--secondary)",
        borderRadius: "var(--radius)",
      }}
    >
      <StartedByContent detail={detail} />
    </section>
  );
}

export function FleetRolloutFailureActions({
  onPause,
  onCancelRemaining,
}: {
  onPause?: () => void;
  onCancelRemaining?: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <SecondaryButton type="button" onClick={onPause}>
        {deploymentCopy.fleetRolloutDetail.pauseRollout}
      </SecondaryButton>
      <SecondaryButton
        type="button"
        onClick={onCancelRemaining}
        className="!text-[#C9190B]"
      >
        {deploymentCopy.fleetRolloutDetail.cancelRemainingWaves}
      </SecondaryButton>
    </div>
  );
}
