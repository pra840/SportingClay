package com.prama.sportingclay.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Timestamp;

/**
 * Created by pmallapur on 6/19/2016.
 */
@Entity
@Table(name = "SHOOTER")
public class Shooter {

    @Id
    @Column (name = "SHOOTER_ID")
    private Integer shooterId;

    @Column (name = "SHOOTER_NAME")
    private String shooterName;

    @Column (name = "EMAIL_ADDRESS")
    private String shooterEmailAddress;

    @Column (name = "SHOOTER_CLASS")
    private Integer shooterClassId;

    @Column (name = "PHONE_NUM")
    private Integer phoneNumber;

    @Column (name = "OCCUPATION")
    private String occupation;

    @Column (name = "DATE_OF_BIRTH")
    private Timestamp dateOfBirth;

    @Column (name = "RGSTD_TIME")
    private Timestamp registrationdate;

    public Integer getShooterClassId() {
        return shooterClassId;
    }

    public void setShooterClassId(Integer shooterClassId) {
        this.shooterClassId = shooterClassId;
    }

    public Integer getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(Integer phoneNumber) {
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

    public Timestamp getRegistrationdate() {
        return registrationdate;
    }

    public void setRegistrationdate(Timestamp registrationdate) {
        this.registrationdate = registrationdate;
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

    public ShooterClassEnum getShooterClass() {
        return ShooterClassEnum.getShooterClass(shooterClassId);
    }
}
