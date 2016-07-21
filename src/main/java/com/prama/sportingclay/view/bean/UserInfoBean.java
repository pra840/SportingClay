package com.prama.sportingclay.view.bean;

/**
 * Created by pmallapur on 6/27/2016.
 */
public class UserInfoBean extends PageDataBean {
    private String userName;
    private String password;
    private QuestionBean questionBean;
    private String email;
    private String shooterClass;
    private Integer phoneNumber;
    private String occupation;
    private String role;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public QuestionBean getQuestionBean() {
        return questionBean;
    }

    public void setQuestionBean(QuestionBean questionBean) {
        this.questionBean = questionBean;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getShooterClass() {
        return shooterClass;
    }

    public void setShooterClass(String shooterClass) {
        this.shooterClass = shooterClass;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
