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
        image: prom/mysqld-exporter:latest
        ports:
        - containerPort: 9104
          name: metrics
        env:
        - name: DATA_SOURCE_NAME
          value: "root:gaurav@(mysql:3306)/stockdb"
        args:
        - --collect.info_schema.processlist
        - --collect.info_schema.innodb_tablespaces
        - --collect.info_schema.innodb_metrics
        - --collect.global_status
        - --collect.global_variables
        - --collect.slave_status
        - --collect.info_schema.tables
        - --collect.info_schema.innodb_cmp
        - --collect.info_schema.innodb_cmpmem
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

    writeFile file: "mysql-exporter.yaml", text: mysqlExporterYaml
    sh "kubectl apply -f mysql-exporter.yaml"
}

return this