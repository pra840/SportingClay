package com.prama.sportingclay.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

import static javax.persistence.GenerationType.SEQUENCE;

/**
 * Created by pmallapur on 6/19/2016.
 */
@Entity
@Table(name = "SHOOTER")
public class Shooter extends PersistentObject implements Serializable{

    @Id
    @SequenceGenerator(name="SHOOTER_ID_SEQ_GENERATOR", sequenceName="SHOOTER_ID_SEQ" , allocationSize = 1)
    @GeneratedValue(strategy = SEQUENCE, generator="SHOOTER_ID_SEQ_GENERATOR")
    @Column(name = "SHOOTER_ID")
    private Integer shooterId;

    @Column (name = "SHOOTER_NAME")
    private String shooterName;

    @Column (name = "EMAIL_ADDRESS")
    private String shooterEmailAddress;

    @Column (name = "SHOOTER_CLASS")
    private Integer shooterClassId;

    @Column (name = "PHONE_NUM")
    private Long phoneNumber;

    @Column (name = "OCCUPATION")
    private String occupation;

    @Column (name = "DATE_OF_BIRTH")
    private Timestamp dateOfBirth;

    public Integer getShooterClassId() {
        return shooterClassId;
    }

    public void setShooterClassId(Integer shooterClassId) {
        this.shooterClassId = shooterClassId;
    }

    public Long getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(Long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public Timestamp getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Timestamp dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Integer getShooterId() {
        return shooterId;
    }

    public void setShooterId(Integer shooterId) {
        this.shooterId = shooterId;
    }

    public String getShooterName() {
        return shooterName;
    }

    public void setShooterName(String shooterName) {
        this.shooterName = shooterName;
    }

    public String getShooterEmailAddress() {
        return shooterEmailAddress;
    }

    public void setShooterEmailAddress(String shooterEmailAddress) {
        this.shooterEmailAddress = shooterEmailAddress;
    }
}
