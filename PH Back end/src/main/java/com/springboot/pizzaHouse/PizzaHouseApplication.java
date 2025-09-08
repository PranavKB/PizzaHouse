package com.springboot.pizzaHouse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.springboot.pizzaHouse.repository")
@EntityScan(basePackages = "com.springboot.pizzaHouse.model")
public class PizzaHouseApplication {

	public static void main(String[] args) {
		SpringApplication.run(PizzaHouseApplication.class, args);
	}

}
