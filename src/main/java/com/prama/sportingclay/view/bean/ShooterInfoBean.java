package com.prama.sportingclay.view.bean;


import com.fasterxml.jackson.annotation.JsonInclude;

import java.sql.Timestamp;

/**
 * Created by pmallapur on 6/19/2016.
 */

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ShooterInfoBean extends PageDataBean {
    private String emailAddress;
    private String shooterClass;
    private Integer phoneNumber;
    private String occupation;
    private Long dateOfBirth;
    private Long registrationDate;
    private LoginDataBean loginDataBean;

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

    public Long getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Long dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Long getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Long registrationDate) {
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

    public LoginDataBean getLoginDataBean() {
        return loginDataBean;
    }

    public void setLoginDataBean(LoginDataBean loginDataBean) {
        this.loginDataBean = loginDataBean;
    }
}
