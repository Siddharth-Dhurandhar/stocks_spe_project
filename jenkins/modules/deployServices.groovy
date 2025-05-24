def execute(dockerRepo) {
    def servicePorts = [
        'gateway'        : 8085,
        'outputmonitor'  : 9000,
        'price_monitor'  : 8091,
        'signup'         : 9010,
        'user_activity'  : 9020,
        'frontend_nw'    : 5173
    ]
    
    def serviceIps = [
        'gateway-ip': '10.100.0.10',
        'outputmonitor-ip': '10.100.0.11',
        'price-monitor-ip': '10.100.0.12',
        'signup-ip': '10.100.0.13',
        'frontend-ip': '10.100.0.15',
        'user-activity-ip': '10.100.0.17'
    ]
    
    for (service in servicePorts.keySet()) {
        def port = servicePorts[service]
        def k8sName = service.replaceAll('_', '-').toLowerCase()
        def isFrontend = (k8sName == 'frontend-nw')
        def serviceType = isFrontend ? 'NodePort' : 'ClusterIP'
        def servicePort = 80  // Internal port for all services
        def targetPort = isFrontend ? 80 : port
        
        def ipKey = k8sName.replaceAll('-nw', '') + '-ip'
        def fixedIp = serviceIps[ipKey]
        
        // Build the service YAML with conditional nodePort
        def serviceYaml = """\
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
    targetPort: ${targetPort}"""
    
        if (isFrontend) {
            serviceYaml += """
    nodePort: 31000"""
        }
        
        serviceYaml += """
  type: ${serviceType}
  clusterIP: ${fixedIp}
"""
        
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
${serviceYaml}
"""
        writeFile file: "${k8sName}-statefulset.yaml", text: statefulSetYaml
        sh "kubectl apply -f ${k8sName}-statefulset.yaml"
    }
}

return this