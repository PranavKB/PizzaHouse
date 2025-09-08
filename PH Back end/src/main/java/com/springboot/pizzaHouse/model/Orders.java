package com.springboot.pizzaHouse.model;

import java.time.LocalDateTime;

public class Orders {

    private String orderEmailId; 
	private String orderAddresss;
	private String orderName;
	private String orderPinCode;
	private String orderMobileNo;
	private int orderTotal;
	private LocalDateTime orderTS;
	private int paymentId;
	private int orderStatusId;

    public Orders() {
    }

    public Orders(String orderEmailId, String orderAddresss, String orderName, String orderPinCode,
            String orderMobileNo, int orderTotal, LocalDateTime orderTS, int paymentId, int orderStatusId) {
        this.orderEmailId = orderEmailId;
        this.orderAddresss = orderAddresss;
        this.orderName = orderName;
        this.orderPinCode = orderPinCode;
        this.orderMobileNo = orderMobileNo;
        this.orderTotal = orderTotal;
        this.orderTS = orderTS;
        this.paymentId = paymentId;
        this.orderStatusId = orderStatusId;
    }

    public String getOrderEmailId() {
        return orderEmailId;
    }

    public void setOrderEmailId(String orderEmailId) {
        this.orderEmailId = orderEmailId;
    }

    public String getOrderAddresss() {
        return orderAddresss;
    }

    public void setOrderAddresss(String orderAddresss) {
        this.orderAddresss = orderAddresss;
    }

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public String getOrderPinCode() {
        return orderPinCode;
    }

    public void setOrderPinCode(String orderPinCode) {
        this.orderPinCode = orderPinCode;
    }

    public String getOrderMobileNo() {
        return orderMobileNo;
    }

    public void setOrderMobileNo(String orderMobileNo) {
        this.orderMobileNo = orderMobileNo;
    }

    public int getOrderTotal() {
        return orderTotal;
    }

    public void setOrderTotal(int orderTotal) {
        this.orderTotal = orderTotal;
    }

    public LocalDateTime getOrderTS() {
        return orderTS;
    }

    public void setOrderTS(LocalDateTime orderTS) {
        this.orderTS = orderTS;
    }

    public int getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(int paymentID) {
        this.paymentId = paymentID;
    }

    public int getOrderStatusId() {
        return orderStatusId;
    }

    public void setOrderStatus(int orderStatusId) {
        this.orderStatusId = orderStatusId;
    }

    @Override
    public String toString() {
        return "Orders [orderEmailId=" + orderEmailId + ", orderAddresss=" + orderAddresss + ", orderName=" + orderName
                + ", orderPinCode=" + orderPinCode + ", orderMobileNo=" + orderMobileNo + ", orderTotal=" + orderTotal
                + ", orderTS=" + orderTS + ", paymentId=" + paymentId + ", orderStatusId=" + orderStatusId + "]";
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((orderEmailId == null) ? 0 : orderEmailId.hashCode());
        result = prime * result + ((orderAddresss == null) ? 0 : orderAddresss.hashCode());
        result = prime * result + ((orderName == null) ? 0 : orderName.hashCode());
        result = prime * result + ((orderPinCode == null) ? 0 : orderPinCode.hashCode());
        result = prime * result + ((orderMobileNo == null) ? 0 : orderMobileNo.hashCode());
        result = prime * result + orderTotal;
        result = prime * result + ((orderTS == null) ? 0 : orderTS.hashCode());
        result = prime * result + paymentId;
        result = prime * result + orderStatusId;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Orders other = (Orders) obj;
        if (orderEmailId == null) {
            if (other.orderEmailId != null)
                return false;
        } else if (!orderEmailId.equals(other.orderEmailId))
            return false;
        if (orderAddresss == null) {
            if (other.orderAddresss != null)
                return false;
        } else if (!orderAddresss.equals(other.orderAddresss))
            return false;
        if (orderName == null) {
            if (other.orderName != null)
                return false;
        } else if (!orderName.equals(other.orderName))
            return false;
        if (orderPinCode == null) {
            if (other.orderPinCode != null)
                return false;
        } else if (!orderPinCode.equals(other.orderPinCode))
            return false;
        if (orderMobileNo == null) {
            if (other.orderMobileNo != null)
                return false;
        } else if (!orderMobileNo.equals(other.orderMobileNo))
            return false;
        if (orderTotal != other.orderTotal)
            return false;
        if (orderTS == null) {
            if (other.orderTS != null)
                return false;
        } else if (!orderTS.equals(other.orderTS))
            return false;
        if (paymentId != other.paymentId)
            return false;
        if (orderStatusId != other.orderStatusId)
            return false;
        return true;
    }

    
    
}
