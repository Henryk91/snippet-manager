flowchart LR
  %% === Clients & External Systems ===
  subgraph EXT["External / Clients"]
    U["User / CI"]
    K["kubectl / API Clients"]
    OIDC["OIDC / Identity Provider"]
    REG["Container Registry"]
    EXT_LB["External Load Balancer / DNS"]
  end

  %% === Control Plane ===
  subgraph CP["Control Plane"]
    APIS["API Server"]
    ETCD["etcd"]
    CM["Controller Manager"]
    SCH["Scheduler"]
    CCM["Cloud Controller Manager"]
    ADM["Admission Controllers"]
  end

  %% === Cluster Networking Layer ===
  subgraph NET["Cluster Networking"]
    CNI["CNI Plugin"]
    KPROXY["Kube-Proxy"]
    COREDNS["CoreDNS"]
    INGRESS_CTL["Ingress Controller"]
    SVC["Service (ClusterIP / NodePort / LB)"]
    EPS["EndpointSlice"]
  end

  %% === Nodes / Workers ===
  subgraph NODES["Worker Nodes"]
    direction TB
    subgraph NODEA["Node A"]
      KUBELETA["Kubelet"]
      CRIA["Container Runtime"]
      PODA["Pods"]
    end
    subgraph NODEB["Node B"]
      KUBELETB["Kubelet"]
      CRIB["Container Runtime"]
      PODB["Pods"]
    end
  end

  %% === Storage ===
  subgraph STG["Storage"]
    CSI_CTRL["CSI Controller"]
    SC["StorageClass"]
    PVC["PersistentVolumeClaim"]
    PV["PersistentVolume"]
    SNAP["VolumeSnapshot / SnapshotClass"]
  end

  %% === Security & Policy ===
  subgraph SEC["Security & Policy"]
    RBAC["RBAC (Roles/Bindings)"]
    SA["ServiceAccounts & Tokens"]
    PSPOD["Pod Security (Baseline / Restricted)"]
    OPA["Policy Engine (Gatekeeper / Kyverno)"]
  end

  %% === Observability ===
  subgraph OBS["Observability"]
    EVENTS["Events"]
    LOGS["Logs"]
    METRICS["Metrics Server"]
    PROM["Prometheus / Grafana / Alertmanager"]
    OTEL["Tracing (OpenTelemetry)"]
    AUDIT["Audit Logs"]
  end

  %% === Packaging & GitOps ===
  subgraph PKG["Packaging & GitOps"]
    HELM["Helm"]
    GITOPS["GitOps (Argo CD / Flux)"]
  end

  %% === Flows ===
  U --> K --> APIS
  OIDC --> APIS
  APIS <--> ETCD
  CM --> APIS
  SCH --> APIS
  CCM --> APIS
  ADM --> APIS

  %% Scheduling & Reconciliation
  APIS -->|watch| CM
  APIS -->|schedule| SCH
  APIS -->|pod/node mgmt| KUBELETA
  APIS --> KUBELETB

  %% Node runtime
  KUBELETA --> CRIA
  KUBELETB --> CRIB
  PODA --> SVC
  PODB --> SVC

  %% Networking
  CNI --- KPROXY
  COREDNS --> SVC
  INGRESS_CTL --> SVC
  EXT_LB --> INGRESS_CTL

  %% Storage
  CSI_CTRL --> APIS
  PVC --> APIS
  SC --> APIS
  PV --- CSI_CTRL
  PVC --> PV
  SNAP --- CSI_CTRL

  %% Security/Policy integration
  RBAC --> APIS
  SA --> APIS
  PSPOD --> APIS
  OPA --> ADM

  %% Observability integration
  EVENTS --> APIS
  LOGS --> APIS
  METRICS --> APIS
  PROM --> APIS
  OTEL --> APIS
  AUDIT --> APIS

  %% Packaging & delivery
  HELM --> APIS
  GITOPS --> APIS
  REG --> CRIA
  REG --> CRIB

  %% Endpoint discovery
  SVC --> EPS
