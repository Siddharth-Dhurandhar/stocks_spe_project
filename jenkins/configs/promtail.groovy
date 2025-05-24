def deploy() {
    def promtailConfigYaml = '''
apiVersion: v1
kind: ConfigMap
metadata:
  name: promtail-config
data:
  promtail-config.yaml: |
    server:
      http_listen_port: 9080
    positions:
      filename: /tmp/positions.yaml
    clients:
      - url: http://loki-service:3100/loki/api/v1/push
        
    scrape_configs:
    - job_name: kubernetes-pods
      kubernetes_sd_configs:
      - role: pod
      pipeline_stages:
        - docker: {}
        - cri: {}
      relabel_configs:
        - source_labels: [__meta_kubernetes_pod_label_app]
          action: replace
          target_label: app
        - source_labels: [__meta_kubernetes_pod_name]
          action: replace
          target_label: pod
        - source_labels: [__meta_kubernetes_namespace]
          action: replace
          target_label: namespace
        - source_labels: [__meta_kubernetes_pod_container_name]
          action: replace
          target_label: container
        - action: labelmap
          regex: __meta_kubernetes_pod_label_(.+)
        - replacement: /var/log/pods/*$1/*.log
          separator: /
          source_labels:
            - __meta_kubernetes_pod_uid
            - __meta_kubernetes_pod_container_name
          target_label: __path__
'''

    def promtailYaml = '''
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: promtail
spec:
  selector:
    matchLabels:
      app: promtail
  template:
    metadata:
      labels:
        app: promtail
    spec:
      containers:
      - name: promtail
        image: grafana/promtail:2.8.0
        args:
        - -config.file=/etc/promtail/promtail-config.yaml
        - -client.external-labels=hostname=$(HOSTNAME)
        env:
        - name: HOSTNAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        ports:
        - containerPort: 9080
          name: http-metrics
        volumeMounts:
        - name: promtail-config
          mountPath: /etc/promtail
        - name: containers
          mountPath: /var/lib/docker/containers
          readOnly: true
        - name: pods
          mountPath: /var/log/pods
          readOnly: true
      volumes:
      - name: promtail-config
        configMap:
          name: promtail-config
      - name: containers
        hostPath:
          path: /var/lib/docker/containers
      - name: pods
        hostPath:
          path: /var/log/pods
'''

    // Delete existing Promtail before applying new config
    sh "kubectl delete daemonset promtail --ignore-not-found=true"
    sh "kubectl delete configmap promtail-config --ignore-not-found=true"

    writeFile file: "promtail-config.yaml", text: promtailConfigYaml
    writeFile file: "promtail.yaml", text: promtailYaml
    
    sh "kubectl apply -f promtail-config.yaml"
    sh "kubectl apply -f promtail.yaml"
}

return this