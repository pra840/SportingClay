package com.prama.sportingclay.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "SIGN_UP_INFO")
public class SignUpInfo implements Serializable{

    @Id
    @Column (name= "SHOOTER_ID")
    private Integer shooterId;

    @OneToOne(mappedBy = "questionId", fetch = FetchType.LAZY,cascade=CascadeType.ALL)
    private Question questionId;

    @Column(name = "RGSTD_TIME")
    private Timestamp registrationdate;

    public Integer getShooterId() {
        return shooterId;
    }

    public void setShooterId(Integer shooterId) {
        this.shooterId = shooterId;
    }

    public Timestamp getRegistrationdate() {
        return registrationdate;
    }

    public void setRegistrationdate(Timestamp registrationdate) {
        this.registrationdate = registrationdate;
    }

    public Question getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Question questionId) {
        this.questionId = questionId;
    }
}
