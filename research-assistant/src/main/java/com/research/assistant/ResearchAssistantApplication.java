package com.research.assistant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.research"}) // Add this to cover your packages
public class ResearchAssistantApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResearchAssistantApplication.class, args);
	}

}
