package com.prama.sportingclay.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * Created by pmallapur on 7/7/2016.
 */
@Entity
@Table(name = "ROLE")
public class Role extends PersistentObject implements Serializable{

    @Id
    @Column(name = "ID")
    private Integer id;

    @Column (name = "ROLE")
    private String role;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
