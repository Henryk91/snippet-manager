import type { RawSection } from "../../types/types";

const section: RawSection = {
  id: "kubernetes-yaml",
  label: "Kubernetes YAML",
  identifier: "yaml",
  snippets: [
    {
      title: "Pod",
      description: "Minimal Pod definition with a single container:",
      markdown: `apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: nginx:latest
      ports:
        - containerPort: 80`,
    },
    {
      title: "Deployment",
      description: "Deployment with 3 replicas of an NGINX container:",
      markdown: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: nginx
          image: nginx:1.25
          ports:
            - containerPort: 80`,
    },
    {
      title: "Service (ClusterIP)",
      description: "Expose a Deployment internally using ClusterIP (default):",
      markdown: `apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 80`,
    },
    {
      title: "Service (NodePort)",
      description: "Expose a Deployment externally using NodePort:",
      markdown: `apiVersion: v1
kind: Service
metadata:
  name: my-service-nodeport
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080`,
    },
    {
      title: "Ingress",
      description: "Basic Ingress routing traffic to a Service:",
      markdown: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
    - host: my-app.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80`,
    },
    {
      title: "ConfigMap",
      description: "Define environment variables in a ConfigMap:",
      markdown: `apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
data:
  APP_ENV: production
  APP_DEBUG: "false"`,
    },
    {
      title: "Secret",
      description: "Store sensitive data (base64 encoded values):",
      markdown: `apiVersion: v1
kind: Secret
metadata:
  name: my-secret
type: Opaque
data:
  username: YWRtaW4=   # 'admin'
  password: cGFzc3dvcmQ=   # 'password'`,
    },
    {
      title: "Namespace",
      description: "Create a new namespace:",
      markdown: `apiVersion: v1
kind: Namespace
metadata:
  name: my-namespace`,
    },
    {
      title: "PersistentVolumeClaim",
      description: "Request storage for a Pod (PVC):",
      markdown: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi`,
    },
    {
      title: "Job",
      description: "Run a short-lived batch job:",
      markdown: `apiVersion: batch/v1
kind: Job
metadata:
  name: my-job
spec:
  template:
    spec:
      containers:
        - name: pi
          image: perl
          command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never`,
    },
    {
      title: "CronJob",
      description: "Run a Job on a schedule (every minute):",
      markdown: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: my-cronjob
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: hello
              image: busybox
              args:
                - /bin/sh
                - -c
                - date; echo Hello from Kubernetes CronJob
          restartPolicy: OnFailure`,
    },
  ],
};

export default section;