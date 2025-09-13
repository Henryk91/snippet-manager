flowchart LR
  %% Subgraphs
  subgraph Edge [Devices and Frontend]
    D1[IoT Device]
    D2[Web or App UI]
  end

  subgraph Ingress [Ingress]
    RP[NGINX or ALB]
  end

  subgraph Messaging [Messaging]
    MB[(MQTT Broker)]
    RB[(AMQP Broker RabbitMQ)]
  end

  subgraph Services [Backend Services]
    API[API Layer]
    W1[Workers]
    W2[Command Processors]
  end

  subgraph Data [State and Observability]
    DB[(Database)]
    Cache[(Cache)]
    Obs[Metrics Logs Tracing]
  end

  %% Edges
  D1 -->|MQTT TLS 8883| MB
  D2 -->|WebSocket WSS| RP
  RP --> MB

  API -->|MQTT client| MB
  W1 -->|MQTT or AMQP| MB
  W2 -->|MQTT or AMQP| MB

  D2 <-->|HTTP| API

  MB <-->|bridge or rule engine| RB

  API --> DB
  W1 --> DB
  W2 --> DB
  API --> Cache
  MB --> Obs
  API --> Obs
  W1 --> Obs
  W2 --> Obs
