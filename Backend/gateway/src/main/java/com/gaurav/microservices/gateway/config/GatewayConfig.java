package com.gaurav.microservices.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Add routes for each service's actuator endpoints
                .route("gateway-actuator", r -> r
                        .path("/actuator/**")
                        .uri("http://localhost:8085")
                )
                .route("outputmonitor-actuator", r -> r
                        .path("/outputmonitor/actuator/**")
                        .uri("lb://outputmonitor")
                )
                .route("price-monitor-actuator", r -> r
                        .path("/price-monitor/actuator/**")
                        .uri("lb://price-monitor")
                )
                .route("signup-actuator", r -> r
                        .path("/signup/actuator/**")
                        .uri("lb://signup")
                )
                .route("stock-ingestion-actuator", r -> r
                        .path("/stock-ingestion/actuator/**")
                        .uri("lb://stock-ingestion")
                )
                .route("user-activity-actuator", r -> r
                        .path("/user-activity/actuator/**")
                        .uri("lb://user-activity")
                )
                .build();
    }
}