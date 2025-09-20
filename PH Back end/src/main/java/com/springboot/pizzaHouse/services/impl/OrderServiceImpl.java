package com.springboot.pizzaHouse.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.pizzaHouse.dto.OrderDTO;
import com.springboot.pizzaHouse.extras.AppliedOffer;
import com.springboot.pizzaHouse.extras.OfferCalculationResult;
import com.springboot.pizzaHouse.model.Item;
import com.springboot.pizzaHouse.model.Offer;
import com.springboot.pizzaHouse.model.Order;
import com.springboot.pizzaHouse.model.OrderItem;
import com.springboot.pizzaHouse.model.OrderItemOffer;
import com.springboot.pizzaHouse.model.OrderItemOfferId;
import com.springboot.pizzaHouse.model.OrderStatus;
import com.springboot.pizzaHouse.model.User;
import com.springboot.pizzaHouse.repository.OrderItemOfferRepository;
import com.springboot.pizzaHouse.repository.OrderItemRepository;
import com.springboot.pizzaHouse.repository.OrderRepository;
import com.springboot.pizzaHouse.repository.OrderStatusRepository;
import com.springboot.pizzaHouse.services.EmailService;
import com.springboot.pizzaHouse.services.ItemService;
import com.springboot.pizzaHouse.services.OffersService;
import com.springboot.pizzaHouse.services.OrderService;
import com.springboot.pizzaHouse.services.UserService;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service("OrderService")
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final UserService userService;
	private final ItemService itemService;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final OrderItemOfferRepository orderItemOfferRepository;
	private final OffersService offerService;
	private final OrderStatusRepository orderStatusRepository;
	private final EmailService emailService;

	@Override
    public List<Order> getAllOrders(){

        return orderRepository.findAll();   
    }

	@Override
	public OrderDTO saveOrder(Map<Integer, Integer> orderList, Integer orderStatusId, String email) {
		logger.info("Inside saveOrder...");

		List<OrderItem> updatedOrderItems = new ArrayList<>();
		User user = userService.getUserUsingEmail(email);

		Order order = orderRepository.findOrderByEmailAndOrderStatusId(email, orderStatusId);
		if (order == null) {
			order = new Order();
			order.setOrderAddress(user.getAddress());
			order.setOrderEmailId(user.getEmail());
			order.setOrderMobileNo(user.getMobileNum());
			order.setCustomerName(user.getName());
			order.setOrderPinCode(user.getPincode());
			order.setOrderStatusId(orderStatusId);
		}
		order.setOrderTimeStamp(LocalDateTime.now());

		int orderId = (order.getOrderId() != 0) ? order.getOrderId() : setOrderToDB(order);
		if (orderId == 0) {
			logger.error("Failed to save order");
			return new OrderDTO(Collections.emptyList(), 0);
		}

		// Map existing OrderItems by itemId for lookup
		List<OrderItem> existingOrderItems = order.getOrderItems() != null ? order.getOrderItems() : new ArrayList<>();
		Map<Integer, OrderItem> existingItemsMap = new HashMap<>();
		for (OrderItem item : existingOrderItems) {
			existingItemsMap.put(item.getItemId(), item);
		}

		int total = 0;

		// Process updated order items
		for (Map.Entry<Integer, Integer> entry : orderList.entrySet()) {
			Integer itemId = entry.getKey();
			Integer quantity = entry.getValue();

			if (quantity == null || quantity <= 0) continue;

			Item item = itemService.getItemById(itemId);
			List<Offer> activeOffers = offerService.getActiveOffersForItem(itemId);
			OfferCalculationResult result = offerService.applyAllOffers(item, quantity, activeOffers);

			OrderItem orderItem;
			if (existingItemsMap.containsKey(itemId)) {
				// Update existing item
				orderItem = existingItemsMap.get(itemId);
				orderItem.setQuantity(quantity);
				orderItem.setSubTotal(result.getFinalTotal());
				updateOrderItemQuantity(orderItem);
			} else {
				// Add new item
				orderItem = new OrderItem();
				orderItem.setItemId(itemId);
				orderItem.setItemName(item.getItemName());
				orderItem.setQuantity(quantity);
				orderItem.setPrice(item.getItemPrice());
				orderItem.setSubTotal(result.getFinalTotal());
				orderItem.setOrder(order);

				Long orderItemId = setOrderItemToDB(orderItem, itemId, orderId);
				orderItem.setOrderItemId(orderItemId);
			}

			updatedOrderItems.add(orderItem);
			total += result.getFinalTotal();

			// Remove old offers
			deleteOrderItemOffers(orderItem.getOrderItemId());

			// Save new offers
			for (AppliedOffer applied : result.getAppliedOffers()) {
				OrderItemOffer oio = new OrderItemOffer();
				oio.setId(new OrderItemOfferId(orderItem.getOrderItemId(), applied.getOfferId()));
				oio.setDiscountAmount(applied.getDiscountAmount());
				oio.setOffer(offerService.getOfferById(applied.getOfferId()).orElse(null));
				oio.setOrderItem(orderItem);
				saveOrderItemOffer(oio);
			}
		}

		// Remove items that are no longer in the cart
		for (OrderItem existingItem : existingOrderItems) {
			if (!orderList.containsKey(existingItem.getItemId())) {
				deleteOrderItemOffers(existingItem.getOrderItemId());
				deleteOrderItem(existingItem.getOrderItemId());
			}
		}

		// Update total and save
		order.setOrderTotal(BigDecimal.valueOf(total));
		order.setOrderId(orderId);
		setOrderTotalToDB(order, orderId);
		//order.setOrderItems(updatedOrderItems);

		logger.info("Order saved/updated successfully with ID: {}", orderId);

		return new OrderDTO(order);
	}



	private void saveOrderItemOffer(OrderItemOffer oio) {
		try {
			orderItemOfferRepository.save(oio); 
		} catch (Exception e) {
			logger.error("Failed to save offer for order item", e);
		}
	}

	private void updateOrderItemQuantity(OrderItem item) {
		orderItemRepository.save(item); // JPA will update because it has a primary key
	}

	private void deleteOrderItemOffers(Long orderItemId) {
		orderItemOfferRepository.deleteByOrderItem_OrderItemId(orderItemId); // You need to define this method
	}

	void deleteOrderItem(Long orderItemId) {
		orderItemRepository.deleteByOrderItemId(orderItemId);
	}

    private int setOrderToDB(Order order)
	{
        int orderId = 0;
        try {
            Order savedOrder = orderRepository.save(order);
			if(savedOrder != null) {
				orderId = order.getOrderId() != 0 ? order.getOrderId() : savedOrder.getOrderId();
				logger.info("Order saved successfully with ID: {}", orderId);
			}
			orderRepository.flush();

            //orderId = orderRepository.findOrderIdByOrderEmailId(savedOrder.getOrderEmailId());
            return orderId;
        } catch (Exception e) {
            logger.error("Error occurred while saving order: {}", e.getMessage());
            //e.printStackTrace();
            return orderId;
        }
    }

    private Long setOrderItemToDB(OrderItem orderItem, int itemId, int orderId)
	{
        orderItem.setItemId(itemId);
        
        //orderItem.setOrderId(orderId);
        try {
            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            return savedOrderItem.getOrderItemId();
        } catch (Exception e) {
            logger.error("Error occurred while saving order item: {}", e.getMessage());
            e.printStackTrace();
            return Long.valueOf(0);
        }
    }

    private int setOrderTotalToDB(Order order, int orderId)
	{
        try {
            return orderRepository.updateOrderTotalById(orderId, order.getOrderTotal());
        } catch (Exception e) {
            logger.error("Error occurred while updating order total: {}", e.getMessage());
            e.printStackTrace();
            return 0;
        }
    }

	@Override
	public List<OrderItem> getOrderItems()
	{
		return orderItemRepository.findAll();
	}

	@Override
	public boolean confirmOrder(Long orderId) {
       Order optionalOrder = orderRepository.findOrderByOrderId(orderId);
        if (optionalOrder != null) {
            optionalOrder.setOrderStatusId(4); // 4 - order accepted
            orderRepository.save(optionalOrder);

			emailService.sendOrderConfirmationEmail(optionalOrder.getOrderEmailId(), optionalOrder, optionalOrder.getOrderItems());
            return true;
        }
        return false;
    }


	@Override
	public Map<Integer, Integer> findOrderMap(Integer orderId, Integer statusId) {
		List<Object[]> result = orderItemRepository.findItemQuantitiesByOrderIdAndStatusId(orderId, statusId);

		return result.stream()
			.collect(Collectors.toMap(
				row -> (Integer) row[0],           // itemId
				row -> ((Long) row[1]).intValue()  // quantity
			));
	}

	@Override
	public Map<Integer, Integer> findOrderMapUsingEmail(String email, Integer statusId) {
		List<Object[]> result = orderItemRepository.findItemQuantitiesByEmailAndStatusId(email, statusId);

		return result.stream()
			.collect(Collectors.toMap(
				row -> (Integer) row[0],           // itemId
				row -> ((Long) row[1]).intValue()  // quantity
			));
	}

	@Override
	public boolean clearCart(String email) {
		try {
			Order order = orderRepository.findOrderByEmailAndOrderStatusId(email, 1);
			orderItemRepository.deleteByOrder_OrderId(order.getOrderId());
			orderRepository.deleteByOrderIdAndOrderStatus_OrderStatusId(order.getOrderId(), 1);
			return true;
		} catch (Exception e) {
			logger.error("Error occurred while clearing cart: {}", e.getMessage());
			return false;
		}
	}

	@Override
	public List<Order> getOrderHistory(String email) {
		return orderRepository.findOrdersByEmail(email);
	}

	public List<OrderStatus> getAllOrderStatuses() {
        return orderStatusRepository.findAll();
    }

}
