def execute(dockerRepo, username, password) {
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
        def imageName = "${dockerRepo}/${service.split('/').last().toLowerCase()}"
        sh "echo ${password} | docker login -u ${username} --password-stdin"
        sh "docker push ${imageName}:latest"
    }
}

return this