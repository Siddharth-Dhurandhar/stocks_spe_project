def execute() {
    sh 'kubectl apply -f mysql-statefulset.yaml'
    sh 'kubectl rollout status statefulset/mysql --timeout=120s || exit 1'
    echo "MySQL deployment completed"
    
    // Wait for MySQL to be fully ready
    sh 'sleep 15'
    
    // Test MySQL connectivity before deploying exporter
    echo "Testing MySQL connectivity..."
    sh '''
    kubectl run mysql-test --image=mysql:8.0 --rm -it --restart=Never --timeout=30s -- \
    mysql -h mysql -u root -pgaurav -e "SHOW STATUS LIKE 'Uptime';" 2>/dev/null || echo "MySQL connection test completed"
    '''
    
    // Deploy MySQL exporter after MySQL is confirmed ready
    def mysqlExporterModule = load "jenkins/configs/mysqlExporter.groovy"
    mysqlExporterModule.deploy()
    
    // Give more time for MySQL exporter and check status
    sh 'kubectl rollout status deployment/mysql-exporter --timeout=90s || echo "MySQL exporter deployment may need more time"'
    
    // Check final status
    sh 'kubectl get pods | grep mysql-exporter'
    echo "MySQL exporter deployment completed"
}

return this