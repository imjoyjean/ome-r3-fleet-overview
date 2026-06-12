import { useNavigate } from "react-router";
import {
  PageTitle,
  SmallText,
  TinyText,
  Container,
  SecondaryButton,
  Badge,
} from "../../../imports/UIComponents";
import { deploymentCopy } from "./deploymentPrototypeCopy";
import { FleetRolloutSummarySection } from "./FleetRolloutDetailChrome";
import type { FleetRolloutDetail } from "./fleetRolloutDemoData";

type FleetRolloutInProgressDetailProps = {
  detail: FleetRolloutDetail;
};

function formatDate(d: Date): string {
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FleetRolloutInProgressDetail({
  detail,
}: FleetRolloutInProgressDetailProps) {
  const navigate = useNavigate();

  return (
    <Container className="p-8">
      <div className="mb-4">
        <SecondaryButton
          onClick={() => navigate(deploymentCopy.fleetRollout.basePath)}
          className="flex items-center gap-2"
        >
          <svg className="size-4" fill="none" viewBox="0 0 16 16">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{deploymentCopy.fleetRolloutDetail.backToList}</span>
        </SecondaryButton>
      </div>

      <header className="mb-2">
        <PageTitle className="mb-1">{detail.action}</PageTitle>
        <SmallText
          className="mb-3 font-mono"
          style={{ color: "var(--muted-foreground)", display: "block" }}
        >
          {detail.actionTargets}
        </SmallText>
        <Badge variant="default" className="text-xs">
          {detail.status}
        </Badge>
        {detail.progressSummary ? (
          <TinyText muted className="!mt-2 !block">
            {detail.progressSummary}
          </TinyText>
        ) : null}
      </header>

      <FleetRolloutSummarySection detail={detail} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <TinyText muted className="mb-1">
            {deploymentCopy.fleetRolloutDetail.rolloutId}
          </TinyText>
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {detail.id}
          </SmallText>
        </div>
        <div>
          <TinyText muted className="mb-1">
            {deploymentCopy.fleetRolloutDetail.scope}
          </TinyText>
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {detail.selector} ({detail.affectedClusters} clusters)
          </SmallText>
        </div>
        <div>
          <TinyText muted className="mb-1">
            {deploymentCopy.fleetRolloutDetail.started}
          </TinyText>
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {formatDate(detail.startTime)}
          </SmallText>
        </div>
        <div>
          <TinyText muted className="mb-1">
            {deploymentCopy.fleetRolloutDetail.triggeredBy}
          </TinyText>
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {detail.startedByLabel}
          </SmallText>
        </div>
      </div>
    </Container>
  );
}
