def deploy() {
    def prometheusConfigYaml = '''
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'gateway'
        metrics_path: '/actuator/prometheus'
        static_configs:
          - targets: ['gateway-service:80']
            labels:
              service: gateway
              
      - job_name: 'outputmonitor'
        metrics_path: '/actuator/prometheus'
        static_configs:
          - targets: ['outputmonitor-service:80']
            labels:
              service: outputmonitor
              
      - job_name: 'price-monitor'
        metrics_path: '/actuator/prometheus'
        static_configs:
          - targets: ['price-monitor-service:80']
            labels:
              service: price-monitor
              
      - job_name: 'signup'
        metrics_path: '/actuator/prometheus'
        static_configs:
          - targets: ['signup-service:80']
            labels:
              service: signup
              
      - job_name: 'stock-ingestion'
        metrics_path: '/actuator/prometheus'
        static_configs:
          - targets: ['stock-ingestion-service:80']
            labels:
              service: stock-ingestion
              
      - job_name: 'user-activity'
        metrics_path: '/actuator/prometheus'
        static_configs:
          - targets: ['user-activity-service:80']
            labels:
              service: user-activity
              
      - job_name: 'prometheus'
        metrics_path: '/metrics'
        static_configs:
          - targets: ['localhost:9090']
'''

    def prometheusYaml = '''
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: prometheus-config
          mountPath: /etc/prometheus/
      volumes:
      - name: prometheus-config
        configMap:
          name: prometheus-config
---
apiVersion: v1
kind: Service
metadata:
  name: prometheus-service
spec:
  selector:
    app: prometheus
  ports:
  - port: 9090
    targetPort: 9090
    nodePort: 30090
  type: NodePort
  clusterIP: "10.100.0.20"
'''

    writeFile file: "prometheus-config.yaml", text: prometheusConfigYaml
    writeFile file: "prometheus.yaml", text: prometheusYaml
    
    sh "kubectl apply -f prometheus-config.yaml"
    sh "kubectl apply -f prometheus.yaml"
}

return this