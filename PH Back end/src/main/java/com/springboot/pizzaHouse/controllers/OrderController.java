package com.springboot.pizzaHouse.controllers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.pizzaHouse.dto.OrderDTO;
import com.springboot.pizzaHouse.model.Order;
import com.springboot.pizzaHouse.model.OrderItem;
import com.springboot.pizzaHouse.model.OrderStatus;
import com.springboot.pizzaHouse.security.JwtUtil;
import com.springboot.pizzaHouse.services.OrderService;
import com.springboot.pizzaHouse.services.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    
    @Autowired
	OrderService orderService;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserService userService;

    @GetMapping(value="/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Order>> getAllOrders() {
        // Assuming orderService is injected and available
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // @GetMapping(value="/status/{statusId}", produces = MediaType.APPLICATION_JSON_VALUE)
    // public ResponseEntity<List<Order>> getOrdersByStatusId(@PathVariable Integer statusId) {
    //     List<Order> orders = orderService.getOrdersByStatusId(statusId);
    //     return ResponseEntity.ok(orders);
    // }

    @GetMapping(value="/map/{orderId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<Integer, Integer>> getCartOrder(@PathVariable Integer orderId) {
        Map<Integer, Integer> orderMap = orderService.findOrderMap(orderId, 1);
        return ResponseEntity.ok(orderMap);
    }

    @GetMapping(value="/map", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<Integer, Integer>> getCartOrder(HttpServletRequest req) {
        String email = userService.getEmailFromRequest(req);
        Map<Integer, Integer> orderMap = orderService.findOrderMapUsingEmail(email, 1);
        return ResponseEntity.ok(orderMap);
    }

    @DeleteMapping(value="/map")
    public ResponseEntity<Void> clearCart(HttpServletRequest req) {
        String email = userService.getEmailFromRequest(req);
        orderService.clearCart(email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/newOrder", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody Map<Integer, Integer> orderList, @Valid @RequestParam Integer orderStatus, HttpServletRequest req) {
		System.out.println("Inside create Order Controller.java") ;

		String email = userService.getEmailFromRequest(req) ;
		OrderDTO orderDTO = orderService.saveOrder(orderList, orderStatus, email) ;

        if(orderDTO != null) {
			return new ResponseEntity<OrderDTO>(orderDTO, HttpStatus.CREATED) ;    		
		}
		else {
			return new ResponseEntity<OrderDTO>(HttpStatus.CONFLICT) ;
		}
    }

	@PostMapping(value = "/orderitems", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OrderItem>> getOrderItems(@RequestBody OrderItem orderItem, HttpServletRequest req) {
		System.out.println("Inside getOrderItems Controller.java") ;

		List<OrderItem> orderItems = orderService.getOrderItems() ;

		if(orderItems != null) {
			return new ResponseEntity<List<OrderItem>>(orderItems, HttpStatus.OK) ;
		}
		else {
			return new ResponseEntity<List<OrderItem>>(Collections.emptyList() ,HttpStatus.NOT_FOUND) ;
		}
    }

    @PostMapping("/{orderId}/confirm")
    public ResponseEntity<String> confirmOrder(@PathVariable Long orderId) {
        boolean success = orderService.confirmOrder(orderId);

        if (success) {
            return ResponseEntity.ok("Order confirmed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Order confirmation failed");
        }
    }

    @GetMapping(value="/history", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OrderDTO>> getOrderHistory(HttpServletRequest req) {
        String email = userService.getEmailFromRequest(req);
        List<Order> orderHistory = orderService.getOrderHistory(email);
        List<OrderDTO> orderDTOs = orderHistory.stream()
                        .map(OrderDTO::new)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(orderDTOs);
    }

    @GetMapping(value="/list/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OrderStatus>> getOrderStatusList(HttpServletRequest req) {
        List<OrderStatus> orderStatusList = orderService.getAllOrderStatuses();
        return ResponseEntity.ok(orderStatusList);
    }
}
