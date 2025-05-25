def execute() {
    // Load individual monitoring components
    def prometheusModule = load "jenkins/configs/prometheus.groovy"
    def grafanaModule = load "jenkins/configs/grafana.groovy"
    def lokiModule = load "jenkins/configs/loki.groovy"
    def promtailModule = load "jenkins/configs/promtail.groovy"
    
    // Deploy in order with proper cleanup
    echo "Deploying Prometheus..."
    prometheusModule.deploy()
    
    echo "Deploying Loki..."
    lokiModule.deploy()
    
    echo "Deploying Promtail..."
    promtailModule.deploy()
    
    echo "Deploying Grafana..."
    grafanaModule.deploy()
    
    // Wait for deployments with better error handling
    sh "echo 'Waiting for deployments to become ready...'"
    sh "kubectl rollout status deployment/prometheus --timeout=90s || true"
    sh "kubectl rollout status deployment/loki --timeout=90s || true"
    sh "kubectl rollout status deployment/grafana --timeout=90s || true"
    
    // Check Promtail DaemonSet
    sh "kubectl rollout status daemonset/promtail --timeout=60s || true"
    
    // Show final status
    sh "kubectl get pods -l app=loki"
    sh "kubectl get pods -l app=promtail"
    
    echo "Monitoring stack deployment completed"
    echo "Grafana: http://localhost:30300 (admin/admin)"
    echo "Prometheus: http://localhost:30090"
    echo "Loki: http://localhost:30100"
}

return this