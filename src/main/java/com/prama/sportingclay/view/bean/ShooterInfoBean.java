package com.prama.sportingclay.view.bean;

import java.sql.Timestamp;

/**
 * Created by pmallapur on 6/19/2016.
 */
public class ShooterInfoBean extends PageDataBean {
    private String emailAddress;
    private String shooterClass;
    private Integer phoneNumber;
    private String occupation;
    private Timestamp dateOfBirth;
    private Timestamp registrationDate;

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

    public Timestamp getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Timestamp registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getShooterClass() {
        return shooterClass;
    }

    public void setShooterClass(String shooterClass) {
        this.shooterClass = shooterClass;
    }
}
