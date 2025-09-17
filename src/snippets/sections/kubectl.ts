import type { RawSection } from "../../types/types";

const section: RawSection = {
  id: "kubectl",
  label: "Kubectl",
  identifier: "bash",
  snippets: [
    {
      title: "Cluster Info",
      description: "Show cluster master and services:",
      markdown: `kubectl cluster-info`,
    },
    {
      title: "List Contexts",
      description: "List available contexts:",
      markdown: `kubectl config get-contexts`,
    },
    {
      title: "Switch Context",
      description: "Switch between clusters:",
      markdown: `kubectl config use-context <context>`,
    },
    {
      title: "Get Pods",
      description: "List pods in the current namespace:",
      markdown: `kubectl get pods`,
    },
    {
      title: "Get Pods (All Namespaces)",
      description: "List pods across all namespaces:",
      markdown: `kubectl get pods -A`,
    },
    {
      title: "Describe Pod",
      description: "Show detailed pod info:",
      markdown: `kubectl describe pod <pod>`,
    },
    {
      title: "Logs",
      description: "Print pod logs:",
      markdown: `kubectl logs <pod>`,
    },
    {
      title: "Exec into Pod",
      description: "Open shell inside a running container:",
      markdown: `kubectl exec -it <pod> -- /bin/sh`,
    },
    {
      title: "Get Deployments",
      description: "List deployments:",
      markdown: `kubectl get deployments`,
    },
    {
      title: "Rollout Status",
      description: "Check rollout status of a deployment:",
      markdown: `kubectl rollout status deployment/<deployment>`,
    },
    {
      title: "Rollout Undo",
      description: "Rollback a deployment to the previous version:",
      markdown: `kubectl rollout undo deployment/<deployment>`,
    },
    {
      title: "Apply Config",
      description: "Apply configuration changes from file:",
      markdown: `kubectl apply -f <file.yaml>`,
    },
    {
      title: "Delete Resource",
      description: "Delete resources defined in a file:",
      markdown: `kubectl delete -f <file.yaml>`,
    },
    {
      title: "Delete Pod",
      description: "Delete a specific pod:",
      markdown: `kubectl delete pod <pod>`,
    },
    {
      title: "Create Resource",
      description: "Create resources from a file:",
      markdown: `kubectl create -f <file.yaml>`,
    },
    {
      title: "Get Services",
      description: "List services in the current namespace:",
      markdown: `kubectl get services`,
    },
    {
      title: "Port Forward",
      description: "Forward local port to a service:",
      markdown: `kubectl port-forward svc/<service> 8080:80`,
    },
    {
      title: "Expose Deployment",
      description: "Expose a deployment as a LoadBalancer service:",
      markdown: `kubectl expose deployment <deployment> --type=LoadBalancer --port=80`,
    },
    {
      title: "Get Events",
      description: "View recent events sorted by creation time:",
      markdown: `kubectl get events --sort-by=.metadata.creationTimestamp`,
    },
    {
      title: "Top Pods",
      description: "Show pod CPU and memory usage:",
      markdown: `kubectl top pod`,
    },
    {
      title: "Top Nodes",
      description: "Show node CPU and memory usage:",
      markdown: `kubectl top node`,
    },
    {
      title: "Get Namespaces",
      description: "List all namespaces:",
      markdown: `kubectl get namespaces`,
    },
    {
      title: "Set Namespace",
      description: "Set default namespace for current context:",
      markdown: `kubectl config set-context --current --namespace=<namespace>`,
    },
  ],
};

export default section;