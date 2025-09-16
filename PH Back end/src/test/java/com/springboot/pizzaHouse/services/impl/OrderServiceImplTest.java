package com.springboot.pizzaHouse.services.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import com.springboot.pizzaHouse.extras.AppliedOffer;
import com.springboot.pizzaHouse.extras.OfferCalculationResult;
import com.springboot.pizzaHouse.model.*;
import com.springboot.pizzaHouse.repository.*;
import com.springboot.pizzaHouse.services.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private UserService userService;

    @Mock
    private ItemService itemService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private OrderItemOfferRepository orderItemOfferRepository;

    @Mock
    private OffersService offerService;

    @Mock
    private OrderStatusRepository orderStatusRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User mockUser;
    private Item mockItem;
    private Offer mockOffer;
    private Order mockOrder;
    private OrderItem mockOrderItem;

    @BeforeEach
    void setup() {
        mockUser = new User();
        mockUser.setEmail("user@example.com");
        mockUser.setName("John Doe");
        mockUser.setAddress("123 St");
        mockUser.setMobileNum("1234567890");
        mockUser.setPincode("12345");

        mockItem = new Item();
        mockItem.setItemId(1);
        mockItem.setItemName("Pizza");
        mockItem.setItemPrice(100);

        mockOffer = new Offer();
        mockOffer.setOfferId(Long.valueOf(1));

        mockOrder = new Order();
        mockOrder.setOrderId(1);
        mockOrder.setOrderEmailId(mockUser.getEmail());
        mockOrder.setOrderStatusId(1);
        mockOrder.setOrderTimeStamp(LocalDateTime.now());
        mockOrder.setOrderItems(new ArrayList<>());

        mockOrderItem = new OrderItem();
        mockOrderItem.setOrderItemId(1L);
        mockOrderItem.setItemId(mockItem.getItemId());
        mockOrderItem.setItemName(mockItem.getItemName());
        mockOrderItem.setQuantity(2);
        mockOrderItem.setPrice(mockItem.getItemPrice());
        mockOrderItem.setSubTotal(200);
        mockOrderItem.setOrder(mockOrder);
    }

    @Test
    void testGetAllOrders() {
        when(orderRepository.findAll()).thenReturn(List.of(mockOrder));

        List<Order> orders = orderService.getAllOrders();

        assertNotNull(orders);
        assertEquals(1, orders.size());
        assertEquals(mockOrder.getOrderId(), orders.get(0).getOrderId());
    }

    @Test
    void testSaveOrder_NewOrderWithItems() {
        // Setup input map
        Map<Integer, Integer> orderList = Map.of(mockItem.getItemId(), 2);

        // Mock dependencies
        when(userService.getUserUsingEmail(anyString())).thenReturn(mockUser);
        when(orderRepository.findOrderByEmailAndOrderStatusId(anyString(), anyInt())).thenReturn(null);
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);
        when(itemService.getItemById(anyInt())).thenReturn(mockItem);
        when(offerService.getActiveOffersForItem(anyInt())).thenReturn(List.of(mockOffer));

        // Prepare calculated offer result
        AppliedOffer appliedOffer = new AppliedOffer();
        appliedOffer.setOfferId(mockOffer.getOfferId());
        appliedOffer.setDiscountAmount(0);

        OfferCalculationResult calcResult = new OfferCalculationResult();
        calcResult.setFinalTotal(200);
        calcResult.setAppliedOffers(List.of(appliedOffer));

        when(offerService.applyAllOffers(any(), anyInt(), anyList())).thenReturn(calcResult);
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(mockOrderItem);
        when(offerService.getOfferById(anyLong())).thenReturn(Optional.of(mockOffer));

        // Execute
        List<OrderItem> updatedOrderItems = orderService.saveOrder(orderList, 1, mockUser.getEmail());

        // Verify
        assertNotNull(updatedOrderItems);
        assertEquals(1, updatedOrderItems.size()); // Fixed: should expect 1 item
        OrderItem orderItem = updatedOrderItems.get(0);
        assertEquals(mockItem.getItemId(), orderItem.getItemId());
        assertEquals(2, orderItem.getQuantity());
        assertEquals(200, orderItem.getSubTotal());

        verify(orderItemOfferRepository, times(1)).save(any(OrderItemOffer.class));
    }


    @Test
    void testSaveOrder_ExistingOrderUpdatesItems() {
        Map<Integer, Integer> orderList = Map.of(mockItem.getItemId(), 3);

        mockOrder.setOrderItems(List.of(mockOrderItem));
        when(userService.getUserUsingEmail(anyString())).thenReturn(mockUser);
        when(orderRepository.findOrderByEmailAndOrderStatusId(anyString(), anyInt())).thenReturn(mockOrder);
        when(itemService.getItemById(mockItem.getItemId())).thenReturn(mockItem);
        when(offerService.getActiveOffersForItem(mockItem.getItemId())).thenReturn(Collections.emptyList());

        OfferCalculationResult calcResult = new OfferCalculationResult();
        calcResult.setFinalTotal(300);
        calcResult.setAppliedOffers(Collections.emptyList());

        when(offerService.applyAllOffers(any(), anyInt(), anyList())).thenReturn(calcResult);
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(mockOrderItem);

        List<OrderItem> updatedOrderItems = orderService.saveOrder(orderList, 1, mockUser.getEmail());

        assertNotNull(updatedOrderItems);
        assertEquals(1, updatedOrderItems.size());
        OrderItem orderItem = updatedOrderItems.get(0);
        assertEquals(3, orderItem.getQuantity());
        assertEquals(300, orderItem.getSubTotal());

        verify(orderItemOfferRepository, times(0)).save(any(OrderItemOffer.class));
    }

    @Test
    void testConfirmOrder_Success() {
        when(orderRepository.findOrderByOrderId(1L)).thenReturn(mockOrder);
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);

        boolean result = orderService.confirmOrder(1L);

        assertTrue(result);
        assertEquals(4, mockOrder.getOrderStatusId()); // status updated to accepted
        verify(orderRepository).save(mockOrder);
    }

    @Test
    void testConfirmOrder_Fail() {
        when(orderRepository.findOrderByOrderId(1L)).thenReturn(null);

        boolean result = orderService.confirmOrder(1L);

        assertFalse(result);
        verify(orderRepository, never()).save(any());
    }

    @Test
    void testFindOrderMap_ReturnsMap() {
        Object[] row1 = new Object[] {1, 5L};
        Object[] row2 = new Object[] {2, 3L};
        List<Object[]> data = List.of(row1, row2);

        when(orderItemRepository.findItemQuantitiesByOrderIdAndStatusId(anyInt(), anyInt())).thenReturn(data);

        Map<Integer, Integer> orderMap = orderService.findOrderMap(1, 1);

        assertEquals(2, orderMap.size());
        assertEquals(5, orderMap.get(1));
        assertEquals(3, orderMap.get(2));
    }

    @Test
    void testFindOrderMapUsingEmail_ReturnsMap() {
        Object[] row1 = new Object[] {1, 2L};
        Object[] row2 = new Object[] {3, 5L};
        List<Object[]> data = List.of(row1, row2);

        when(orderItemRepository.findItemQuantitiesByEmailAndStatusId(anyString(), anyInt())).thenReturn(data);

        Map<Integer, Integer> orderMap = orderService.findOrderMapUsingEmail("test@example.com", 1);

        assertEquals(2, orderMap.size());
        assertEquals(2, orderMap.get(1));
    }

    @Test
    void testClearCart_Success() {
        when(orderRepository.findOrderByEmailAndOrderStatusId(anyString(), eq(1))).thenReturn(mockOrder);

        doNothing().when(orderItemRepository).deleteByOrder_OrderId(anyInt());
        doNothing().when(orderRepository).deleteByOrderIdAndOrderStatus_OrderStatusId(anyInt(), eq(1));

        boolean result = orderService.clearCart("test@example.com");

        assertTrue(result);
        verify(orderItemRepository).deleteByOrder_OrderId(mockOrder.getOrderId());
        verify(orderRepository).deleteByOrderIdAndOrderStatus_OrderStatusId(mockOrder.getOrderId(), 1);
    }

    @Test
    void testClearCart_Failure() {
        when(orderRepository.findOrderByEmailAndOrderStatusId(anyString(), eq(1))).thenThrow(new RuntimeException("DB error"));

        boolean result = orderService.clearCart("test@example.com");

        assertFalse(result);
    }

    @Test
    void testGetOrderHistory() {
        when(orderRepository.findOrdersByEmail(anyString())).thenReturn(List.of(mockOrder));

        List<Order> orders = orderService.getOrderHistory("user@example.com");

        assertNotNull(orders);
        assertEquals(1, orders.size());
        assertEquals(mockOrder.getOrderId(), orders.get(0).getOrderId());
    }

    @Test
    void testGetAllOrderStatuses() {
        OrderStatus status = new OrderStatus();
        status.setOrderStatusId(1);
        status.setOrderStatusName("Pending");

        when(orderStatusRepository.findAll()).thenReturn(List.of(status));

        List<OrderStatus> statuses = orderService.getAllOrderStatuses();

        assertNotNull(statuses);
        assertEquals(1, statuses.size());
        assertEquals("Pending", statuses.get(0).getOrderStatusName());
    }
}
