package com.Natwest.project.budgeting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
@EnableEurekaClient
public class BudgetingApplication {

	public static void main(String[] args) {
		SpringApplication.run(BudgetingApplication.class, args);
	}

}
