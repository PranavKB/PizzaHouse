package com.springboot.pizzaHouse.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.springboot.pizzaHouse.model.Order;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class OrderDTO {
    private int orderId;
    private String orderEmailId;
    private String orderAddress;
    private String customerName;
    private String orderPinCode;
    private String orderMobileNo;
    private BigDecimal orderTotal;
    private LocalDateTime orderTimeStamp;
    private int paymentId;
    private String orderStatusName;
    private List<OrderItemDTO> orderItems = new ArrayList<>();


    public OrderDTO(Order order) {
        this.orderId = order.getOrderId();
        this.orderEmailId = order.getOrderEmailId();
        this.orderAddress = order.getOrderAddress();
        this.customerName = order.getCustomerName();
        this.orderPinCode = order.getOrderPinCode();
        this.orderMobileNo = order.getOrderMobileNo();
        this.orderTotal = order.getOrderTotal();
        this.orderTimeStamp = order.getOrderTimeStamp();

       

        if (order.getOrderStatus() != null) {
            this.orderStatusName = order.getOrderStatus().getOrderStatusName();
        }

        this.orderItems = order.getOrderItems().stream()
                .map(OrderItemDTO::new)
                .collect(Collectors.toList());
    }

    public OrderDTO(List<OrderItemDTO> orderItems, int orderId) {
        this.orderItems = orderItems;
        this.orderId = orderId;
    }

}
