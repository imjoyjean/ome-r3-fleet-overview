import { PrimaryButton } from "../../../imports/UIComponents";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  DEPLOYMENT_TAB_ORDER,
  getWizardPresetForTab,
  type DeploymentTabId,
  type WizardEntryMode,
} from "./deploymentTabPresets";
import { deploymentCopy } from "./deploymentPrototypeCopy";

/** Options passed to Deployments `openWizard` (same contract as the page). */
export type OpenDeploymentWizardOptions = {
  tab: DeploymentTabId;
  mode?: WizardEntryMode;
  initialLabelSelector?: string;
  /** When set, Placement opens in “search / pick clusters” with these names (must exist in fleet mock). */
  initialSelectedClusterNames?: string[];
  /** Pre-select a catalog action (e.g. `update-ocp-4.18` for OpenShift cluster upgrade). */
  initialPrimaryActionId?: string;
};

type CreateDeploymentMenuContentProps = {
  onPick: (opts: OpenDeploymentWizardOptions) => void;
};

/** Wizard “Start differently” menu — area + entry mode shortcuts. */
export function CreateDeploymentMenuContent({
  onPick,
}: CreateDeploymentMenuContentProps) {
  return (
    <>
      <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal text-muted-foreground">
        {deploymentCopy.wizard.narrowMenuActionFirstSection}
      </DropdownMenuLabel>
      {DEPLOYMENT_TAB_ORDER.map((t) => (
        <DropdownMenuItem
          key={`af-${t.id}`}
          onSelect={() => onPick({ tab: t.id, mode: "action-first" })}
        >
          {t.label}
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal text-muted-foreground">
        {deploymentCopy.wizard.narrowMenuPlacementFirstSection}
      </DropdownMenuLabel>
      {DEPLOYMENT_TAB_ORDER.map((t) => (
        <DropdownMenuItem
          key={`pf-${t.id}`}
          onSelect={() => onPick({ tab: t.id, mode: "placement-first" })}
        >
          {t.label}
        </DropdownMenuItem>
      ))}
    </>
  );
}

type CreateDeploymentSplitButtonProps = {
  /** List area (All, Platform, Workloads, VM) for defaults when opening the wizard. */
  areaTab: DeploymentTabId;
  onCreate: (opts: OpenDeploymentWizardOptions) => void;
  primaryLabel?: string;
  /** Full width for empty state layout. */
  layout?: "default" | "full";
};

export function CreateDeploymentSplitButton({
  areaTab,
  onCreate,
  primaryLabel = deploymentCopy.wizard.createButton,
  layout = "default",
}: CreateDeploymentSplitButtonProps) {
  const openWizard = () => {
    const preset = getWizardPresetForTab(areaTab);
    onCreate({
      tab: areaTab,
      mode: preset.entryMode,
      initialLabelSelector: preset.initialLabelSelector,
    });
  };

  return (
    <PrimaryButton
      type="button"
      className={layout === "full" ? "w-full max-w-md !py-2.5" : "!py-2.5"}
      onClick={openWizard}
    >
      {primaryLabel}
    </PrimaryButton>
  );
}
