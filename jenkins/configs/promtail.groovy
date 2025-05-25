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
      grpc_listen_port: 0
    positions:
      filename: /tmp/positions.yaml
    clients:
      - url: http://loki-service:3100/loki/api/v1/push
        
    scrape_configs:
    - job_name: kubernetes-pods
      kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
          - default
      pipeline_stages:
      - cri: {}
      relabel_configs:
      - source_labels:
        - __meta_kubernetes_pod_controller_name
        target_label: __service__
      - source_labels:
        - __meta_kubernetes_pod_node_name
        target_label: __host__
      - action: replace
        replacement: $1
        separator: /
        source_labels:
        - __meta_kubernetes_namespace
        - __service__
        target_label: job
      - action: replace
        source_labels:
        - __meta_kubernetes_namespace
        target_label: namespace
      - action: replace
        source_labels:
        - __meta_kubernetes_pod_name
        target_label: pod
      - action: replace
        source_labels:
        - __meta_kubernetes_pod_container_name
        target_label: container
      - action: replace
        source_labels:
        - __meta_kubernetes_pod_label_app
        target_label: app
      - replacement: /var/log/pods/*$1/*.log
        separator: /
        source_labels:
        - __meta_kubernetes_pod_uid
        - __meta_kubernetes_pod_container_name
        target_label: __path__
      - action: replace
        replacement: /var/log/pods/*$1/*.log
        regex: true/(.*)
        separator: /
        source_labels:
        - __meta_kubernetes_pod_annotationpresent_kubernetes_io_config_hash
        - __meta_kubernetes_pod_annotation_kubernetes_io_config_hash
        - __meta_kubernetes_pod_container_name
        target_label: __path__
'''

    def promtailYaml = '''
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: promtail
  labels:
    app: promtail
spec:
  selector:
    matchLabels:
      app: promtail
  template:
    metadata:
      labels:
        app: promtail
    spec:
      serviceAccount: promtail
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
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
            - ALL
          readOnlyRootFilesystem: true
        volumeMounts:
        - name: config
          mountPath: /etc/promtail
        - name: run
          mountPath: /run/promtail
        - mountPath: /var/lib/docker/containers
          name: docker
          readOnly: true
        - mountPath: /var/log/pods
          name: pods
          readOnly: true
      tolerations:
      - effect: NoSchedule
        key: node-role.kubernetes.io/master
        operator: Exists
      volumes:
      - name: config
        configMap:
          name: promtail-config
      - name: run
        hostPath:
          path: /run/promtail
      - name: docker
        hostPath:
          path: /var/lib/docker/containers
      - name: pods
        hostPath:
          path: /var/log/pods
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: promtail
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: promtail
rules:
- apiGroups:
  - ""
  resources:
  - nodes
  - nodes/proxy
  - services
  - endpoints
  - pods
  verbs:
  - get
  - watch
  - list
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: promtail
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: promtail
subjects:
- kind: ServiceAccount
  name: promtail
  namespace: default
'''

    // Delete existing Promtail resources
    sh "kubectl delete daemonset promtail --ignore-not-found=true"
    sh "kubectl delete configmap promtail-config --ignore-not-found=true"
    sh "kubectl delete serviceaccount promtail --ignore-not-found=true"
    sh "kubectl delete clusterrole promtail --ignore-not-found=true"
    sh "kubectl delete clusterrolebinding promtail --ignore-not-found=true"

    // Wait for cleanup
    sh "sleep 5"

    writeFile file: "promtail-config.yaml", text: promtailConfigYaml
    writeFile file: "promtail.yaml", text: promtailYaml
    
    sh "kubectl apply -f promtail-config.yaml"
    sh "kubectl apply -f promtail.yaml"
}

return this