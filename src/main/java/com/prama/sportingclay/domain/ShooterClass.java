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
@Table (name = "SHOOTER_CLASS")
public class ShooterClass extends PersistentObject implements Serializable {

    @Id
    @Column(name = "ID")
    private Integer id;

    @Column (name = "CLASS")
    private String shooterClass;

    public String getShooterClass() {
        return shooterClass;
    }

    public void setShooterClass(String shooterClass) {
        this.shooterClass = shooterClass;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
