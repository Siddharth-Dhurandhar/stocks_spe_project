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
      chunk_idle_period: 5m
      chunk_retain_period: 1m

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
      compaction_interval: 5m

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
        volumeMounts:
        - name: loki-config
          mountPath: /etc/loki
        - name: loki-storage
          mountPath: /tmp/loki
      volumes:
      - name: loki-config
        configMap:
          name: loki-config
      - name: loki-storage
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: loki-service
spec:
  selector:
    app: loki
  ports:
  - port: 3100
    targetPort: 3100
    nodePort: 30100
  type: NodePort
  clusterIP: "10.100.0.22"
'''

    // Delete existing Loki before applying new config
    sh "kubectl delete deployment loki --ignore-not-found=true"
    sh "kubectl delete service loki-service --ignore-not-found=true"
    sh "kubectl delete configmap loki-config --ignore-not-found=true"

    writeFile file: "loki.yaml", text: lokiYaml
    sh "kubectl apply -f loki.yaml"
}

return this