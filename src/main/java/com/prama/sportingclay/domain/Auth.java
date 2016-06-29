package com.prama.sportingclay.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by pmallapur on 6/27/2016.
 */

@Entity
@Table(name = "A_U_T_H")
public class Auth {

    @Id
    @Column(name = "SHOOTER_ID")
    private Integer shooterId;

    @Column (name = "SHOOTER_PASS")
    private String shooterPass;

    @Column (name = "SHOOTER_EMAIL")
    private String shooterEmail;

    public String getShooterEmail() {
        return shooterEmail;
    }

    public void setShooterEmail(String shooterEmail) {
        this.shooterEmail = shooterEmail;
    }

    public Integer getShooterId() {
        return shooterId;
    }

    public String getShooterPass() {
        return shooterPass;
    }

}
