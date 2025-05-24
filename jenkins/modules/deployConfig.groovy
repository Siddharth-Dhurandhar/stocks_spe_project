def createFixedIps() {
    def configYaml = '''
apiVersion: v1
kind: ConfigMap
metadata:
  name: service-ips
data:
  gateway-ip: "10.100.0.10"
  outputmonitor-ip: "10.100.0.11"
  price-monitor-ip: "10.100.0.12"
  signup-ip: "10.100.0.13"
  stock-ingestion-ip: "10.100.0.14"
  frontend-ip: "10.100.0.15"
  mysql-ip: "10.100.0.16"
  user-activity-ip: "10.100.0.17"
  prometheus-ip: "10.100.0.20"
  grafana-ip: "10.100.0.21"
  loki-ip: "10.100.0.22"
'''
    writeFile file: "fixed-ips.yaml", text: configYaml
    sh "kubectl apply -f fixed-ips.yaml"
}

return this