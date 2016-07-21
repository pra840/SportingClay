package com.prama.sportingclay.domain;

import javax.persistence.*;
import java.io.Serializable;

import static javax.persistence.GenerationType.SEQUENCE;

/**
 * Created by pmallapur on 6/27/2016.
 */

@Entity
@Table(name = "A_U_T_H")
public class Auth extends PersistentObject implements Serializable{

    @Column(name = "SHOOTER_ID")
    private Integer shooterId;

    @Id
    @SequenceGenerator(name="SHOOTER_ID_SEQ_GENERATOR", sequenceName="SHOOTER_ID_SEQ" , allocationSize = 1)
    @GeneratedValue(strategy = SEQUENCE, generator="SHOOTER_ID_SEQ_GENERATOR")
    @Column(name = "ID")
    private Integer id;

    @Column (name = "SHOOTER_PASS")
    private String shooterPass;

    @Column (name = "SHOOTER_EMAIL")
    private String shooterEmail;

    @Column (name = "ROLE_ID")
    private Integer roleId;

    public Auth() {
    }

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

    public void setShooterPass(String shooterPass) {
        this.shooterPass = shooterPass;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setShooterId(Integer shooterId) {
        this.shooterId = shooterId;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }
}
