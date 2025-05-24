def deploy() {
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
        - name: DATA_SOURCE_NAME
          value: "root:gaurav@tcp(mysql:3306)/"
        - name: MYSQLD_EXPORTER_WEB_LISTEN_ADDRESS
          value: "0.0.0.0:9104"
        args:
        - --web.listen-address=0.0.0.0:9104
        - --collect.global_status
        - --collect.global_variables
        - --collect.info_schema.processlist
        - --collect.info_schema.tables
        livenessProbe:
          httpGet:
            path: /
            port: 9104
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 9104
          initialDelaySeconds: 5
          periodSeconds: 5
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

    // Delete existing deployment first to avoid conflicts
    sh "kubectl delete deployment mysql-exporter --ignore-not-found=true"
    sh "kubectl delete service mysql-exporter-service --ignore-not-found=true"
    
    // Wait a bit for cleanup
    sh "sleep 5"
    
    writeFile file: "mysql-exporter.yaml", text: mysqlExporterYaml
    sh "kubectl apply -f mysql-exporter.yaml"
}

return this