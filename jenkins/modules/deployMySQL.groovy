def execute() {
    sh 'kubectl apply -f mysql-statefulset.yaml'
    sh 'kubectl rollout status statefulset/mysql --timeout=120s || exit 1'
    echo "MySQL deployment completed"
}

return this