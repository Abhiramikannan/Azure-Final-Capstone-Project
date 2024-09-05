package com.capstone.project.samplePortfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
@EnableEurekaClient
public class SamplePortfolioApplication {

	public static void main(String[] args) {
		SpringApplication.run(SamplePortfolioApplication.class, args);
	}
	@Bean
	@LoadBalanced
	public WebClient webClient() {
		return WebClient.builder().build();
	}
}
