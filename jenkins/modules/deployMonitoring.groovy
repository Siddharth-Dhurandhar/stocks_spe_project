def execute() {
    // Load individual monitoring components
    def prometheusModule = load "jenkins/configs/prometheus.groovy"
    def grafanaModule = load "jenkins/configs/grafana.groovy"
    def lokiModule = load "jenkins/configs/loki.groovy"
    def promtailModule = load "jenkins/configs/promtail.groovy"
    
    // Deploy Prometheus
    prometheusModule.deploy()
    
    // Deploy Grafana
    grafanaModule.deploy()
    
    // Deploy Loki
    lokiModule.deploy()
    
    // Deploy Promtail
    promtailModule.deploy()
    
    // Wait for deployments
    sh "echo 'Waiting for deployments to become ready...'"
    sh "kubectl rollout status deployment/prometheus --timeout=60s || true"
    sh "kubectl rollout status deployment/grafana --timeout=60s || true"
    sh "kubectl rollout status deployment/loki --timeout=60s || true"
    
    echo "Monitoring stack deployment completed"
}

return this