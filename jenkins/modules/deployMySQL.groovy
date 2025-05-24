def execute() {
    sh 'kubectl apply -f mysql-statefulset.yaml'
    sh 'kubectl rollout status statefulset/mysql --timeout=120s || exit 1'
    echo "MySQL deployment completed"
    
    // Deploy MySQL exporter after MySQL is ready
    def mysqlExporterModule = load "jenkins/configs/mysqlExporter.groovy"
    mysqlExporterModule.deploy()
    
    sh 'kubectl rollout status deployment/mysql-exporter --timeout=60s || true'
    echo "MySQL exporter deployment completed"
}

return this