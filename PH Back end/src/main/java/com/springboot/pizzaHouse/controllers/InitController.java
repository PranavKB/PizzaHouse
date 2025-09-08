package com.springboot.pizzaHouse.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class InitController {

	@RequestMapping(value="/" , method=RequestMethod.GET)
	public String getHome() {
		System.out.println("Inside InitController.java: returning jsp file name 'template'...");
		return "template" ;
	}


}
