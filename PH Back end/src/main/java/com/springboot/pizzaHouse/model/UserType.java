package com.springboot.pizzaHouse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "user_type")
@AllArgsConstructor
public class UserType {

    @Id
    @Column(name = "user_type_id")
    private Integer id;

    @Column(name = "user_type_name", nullable = false, unique = true)
    private String name;

    @Column(name = "user_type_description")
    private String description;

    public UserType() {
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    
}

