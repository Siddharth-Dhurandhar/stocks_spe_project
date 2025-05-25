def deploy() {
    def lokiYaml = '''
apiVersion: v1
kind: ConfigMap
metadata:
  name: loki-config
data:
  loki.yaml: |
    auth_enabled: false
    
    server:
      http_listen_port: 3100
      log_level: info

    distributor:
      ring:
        kvstore:
          store: inmemory

    ingester:
      wal:
        enabled: true
        dir: /tmp/loki/wal
      lifecycler:
        ring:
          kvstore:
            store: inmemory
          replication_factor: 1
        final_sleep: 0s
      chunk_idle_period: 1h
      max_chunk_age: 1h
      chunk_retain_period: 30s
      max_transfer_retries: 0

    schema_config:
      configs:
      - from: 2021-01-01
        store: boltdb-shipper
        object_store: filesystem
        schema: v11
        index:
          prefix: index_
          period: 24h

    storage_config:
      boltdb_shipper:
        active_index_directory: /tmp/loki/index
        cache_location: /tmp/loki/index_cache
        shared_store: filesystem
      filesystem:
        directory: /tmp/loki/chunks

    compactor:
      working_directory: /tmp/loki/compactor
      shared_store: filesystem
      compaction_interval: 10m

    ruler:
      storage:
        type: local
        local:
          directory: /tmp/loki/rules
      rule_path: /tmp/loki/rules
      alertmanager_url: ""
      enable_api: false

    limits_config:
      reject_old_samples: true
      reject_old_samples_max_age: 168h
      ingestion_rate_mb: 16
      ingestion_burst_size_mb: 32
      max_line_size: 256000
      max_label_name_length: 1024
      max_label_value_length: 4096
      max_label_names_per_series: 30

    chunk_store_config:
      max_look_back_period: 0s

    table_manager:
      retention_deletes_enabled: false
      retention_period: 0s
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: loki
  labels:
    app: loki
spec:
  replicas: 1
  selector:
    matchLabels:
      app: loki
  template:
    metadata:
      labels:
        app: loki
    spec:
      securityContext:
        fsGroup: 10001
        runAsUser: 10001
        runAsGroup: 10001
      containers:
      - name: loki
        image: grafana/loki:2.8.0
        args:
        - -config.file=/etc/loki/loki.yaml
        ports:
        - containerPort: 3100
          name: http-metrics
        env:
        - name: JAEGER_AGENT_HOST
          value: ""
        livenessProbe:
          httpGet:
            path: /ready
            port: http-metrics
          initialDelaySeconds: 45
        readinessProbe:
          httpGet:
            path: /ready
            port: http-metrics
          initialDelaySeconds: 45
        volumeMounts:
        - name: config
          mountPath: /etc/loki
        - name: storage
          mountPath: /tmp/loki
      volumes:
      - name: config
        configMap:
          name: loki-config
      - name: storage
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: loki-service
  labels:
    app: loki
spec:
  type: NodePort
  ports:
  - port: 3100
    protocol: TCP
    name: http-metrics
    targetPort: http-metrics
    nodePort: 30100
  selector:
    app: loki
  clusterIP: "10.100.0.22"
'''

    // Delete existing Loki before applying new config
    sh "kubectl delete deployment loki --ignore-not-found=true"
    sh "kubectl delete service loki-service --ignore-not-found=true"
    sh "kubectl delete configmap loki-config --ignore-not-found=true"

    // Wait for cleanup
    sh "sleep 10"

    writeFile file: "loki.yaml", text: lokiYaml
    sh "kubectl apply -f loki.yaml"
}

return this