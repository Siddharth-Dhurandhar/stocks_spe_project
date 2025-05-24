def execute(dockerRepo) {
    def services = [
        './Backend/gateway',
        './Backend/OutputMonitor',
        './Backend/price_monitor',
        './Backend/SignUp',
        './Backend/stock_ingestion',
        './Backend/user_activity',
        './Frontend_nw'
    ]
    
    for (service in services) {
        dir(service) {
            if (!service.endsWith('Frontend_nw')) {
                sh 'mvn clean package -DskipTests'
            }
            def imageName = "${dockerRepo}/${service.split('/').last().toLowerCase()}"
            sh "docker build -t ${imageName}:latest ."
        }
    }
}

return this