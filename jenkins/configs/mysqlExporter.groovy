def deploy() {
    // First create a ConfigMap with MySQL configuration
    def mysqlConfigYaml = '''
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-exporter-config
data:
  .my.cnf: |
    [client]
    user=root
    password=gaurav
    host=mysql
    port=3306
'''

    def mysqlExporterYaml = '''
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-exporter
  labels:
    app: mysql-exporter
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql-exporter
  template:
    metadata:
      labels:
        app: mysql-exporter
    spec:
      containers:
      - name: mysql-exporter
        image: prom/mysqld-exporter:v0.15.1
        ports:
        - containerPort: 9104
          name: metrics
        env:
        - name: MYSQLD_EXPORTER_WEB_LISTEN_ADDRESS
          value: "0.0.0.0:9104"
        - name: MYSQLD_EXPORTER_WEB_TELEMETRY_PATH
          value: "/metrics"
        args:
        - --web.listen-address=0.0.0.0:9104
        - --config.my-cnf=/etc/mysql/.my.cnf
        - --collect.global_status
        - --collect.global_variables
        - --collect.info_schema.processlist
        - --collect.info_schema.tables
        - --collect.info_schema.innodb_metrics
        volumeMounts:
        - name: mysql-config
          mountPath: /etc/mysql
          readOnly: true
        livenessProbe:
          httpGet:
            path: /metrics
            port: 9104
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /metrics
            port: 9104
          initialDelaySeconds: 10
          periodSeconds: 5
      volumes:
      - name: mysql-config
        configMap:
          name: mysql-exporter-config
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-exporter-service
spec:
  selector:
    app: mysql-exporter
  ports:
  - port: 9104
    targetPort: 9104
  type: ClusterIP
  clusterIP: "10.100.0.23"
'''

    // Delete existing resources first
    sh "kubectl delete deployment mysql-exporter --ignore-not-found=true"
    sh "kubectl delete service mysql-exporter-service --ignore-not-found=true"
    sh "kubectl delete configmap mysql-exporter-config --ignore-not-found=true"
    
    // Wait for cleanup
    sh "sleep 10"
    
    // Apply new configuration
    writeFile file: "mysql-exporter-config.yaml", text: mysqlConfigYaml
    writeFile file: "mysql-exporter.yaml", text: mysqlExporterYaml
    
    sh "kubectl apply -f mysql-exporter-config.yaml"
    sh "kubectl apply -f mysql-exporter.yaml"
}

return this