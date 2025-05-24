def execute(dockerRepo) {
    def service = 'stock_ingestion'
    def port = 8090
    def k8sName = service.replaceAll('_', '-').toLowerCase()
    def serviceType = 'ClusterIP'
    def servicePort = 80
    def targetPort = port
    def fixedIp = '10.100.0.14'
    
    def statefulSetYaml = """\
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: ${k8sName}
spec:
  serviceName: "${k8sName}-service"
  replicas: 1
  selector:
    matchLabels:
      app: ${k8sName}
  template:
    metadata:
      labels:
        app: ${k8sName}
    spec:
      containers:
      - name: ${k8sName}
        image: ${dockerRepo}/${service}:latest
        ports:
        - containerPort: ${port}
---
apiVersion: v1
kind: Service
metadata:
  name: ${k8sName}-service
spec:
  selector:
    app: ${k8sName}
  ports:
  - protocol: TCP
    port: ${servicePort}
    targetPort: ${targetPort}
  type: ${serviceType}
  clusterIP: ${fixedIp}
"""
    writeFile file: "${k8sName}-statefulset.yaml", text: statefulSetYaml
    sh "kubectl apply -f ${k8sName}-statefulset.yaml"
    sh "kubectl rollout status statefulset/${k8sName} --timeout=120s || exit 1"
    echo "Stock Ingestion deployment completed"
}

return this