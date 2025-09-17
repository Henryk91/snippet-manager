import type { RawSection } from "../../types/types";

const section: RawSection = {
  id: "helm",
  label: "Helm",
  identifier: "bash",
  snippets: [
    {
      title: "Helm Version",
      description: "Check the installed Helm version:",
      markdown: `helm version`,
    },
    {
      title: "Search Charts (Hub)",
      description: "Search charts in the Artifact Hub:",
      markdown: `helm search hub <keyword>`,
    },
    {
      title: "Search Charts (Repo)",
      description: "Search charts in configured repositories:",
      markdown: `helm search repo <keyword>`,
    },
    {
      title: "Add Repository",
      description: "Add a new Helm chart repository:",
      markdown: `helm repo add <name> <url>`,
    },
    {
      title: "Update Repositories",
      description: "Update information of available charts:",
      markdown: `helm repo update`,
    },
    {
      title: "List Repositories",
      description: "List configured chart repositories:",
      markdown: `helm repo list`,
    },
    {
      title: "Create Chart",
      description: "Create a new Helm chart scaffold:",
      markdown: `helm create <chart-name>`,
    },
    {
      title: "Package Chart",
      description: "Package a chart directory into a .tgz archive:",
      markdown: `helm package <chart-dir>`,
    },
    {
      title: "Install Release",
      description: "Install a chart with a release name:",
      markdown: `helm install <release> <repo>/<chart>`,
    },
    {
      title: "Upgrade Release",
      description: "Upgrade a release to a new chart version:",
      markdown: `helm upgrade <release> <repo>/<chart>`,
    },
    {
      title: "Uninstall Release",
      description: "Remove a release from Kubernetes:",
      markdown: `helm uninstall <release>`,
    },
    {
      title: "List Releases",
      description: "List all Helm releases in the current namespace:",
      markdown: `helm list`,
    },
    {
      title: "List Releases (All Namespaces)",
      description: "List releases across all namespaces:",
      markdown: `helm list -A`,
    },
    {
      title: "Get Values",
      description: "Show values used in a release:",
      markdown: `helm get values <release>`,
    },
    {
      title: "Get Manifest",
      description: "Show the rendered Kubernetes manifests of a release:",
      markdown: `helm get manifest <release>`,
    },
    {
      title: "Dry Run Install/Upgrade",
      description: "Simulate an install or upgrade without applying:",
      markdown: `helm install <release> <chart> --dry-run --debug`,
    },
    {
      title: "Template Chart",
      description: "Render chart templates locally without installing:",
      markdown: `helm template <release> <chart>`,
    },
    {
      title: "Rollback Release",
      description: "Roll back a release to a previous version:",
      markdown: `helm rollback <release> <revision>`,
    },
    {
      title: "History",
      description: "View revision history of a release:",
      markdown: `helm history <release>`,
    },
    {
      title: "Lint Chart",
      description: "Check a chart for issues before installing:",
      markdown: `helm lint <chart-dir>`,
    },
    {
      title: "Dependency Update",
      description: "Update chart dependencies:",
      markdown: `helm dependency update <chart-dir>`,
    },
  ],
};

export default section;