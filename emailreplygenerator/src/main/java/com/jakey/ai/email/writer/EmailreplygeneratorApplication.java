package com.jakey.ai.email.writer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.jakey.ai.email.writer"})
public class EmailreplygeneratorApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmailreplygeneratorApplication.class, args);
	}

}
