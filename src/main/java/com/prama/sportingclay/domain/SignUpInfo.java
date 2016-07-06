package com.prama.sportingclay.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

import static javax.persistence.GenerationType.SEQUENCE;

@Entity
@Table(name = "SIGN_UP_INFO")
public class SignUpInfo extends PersistentObject implements Serializable{

    @Id
    @SequenceGenerator(name="SHOOTER_ID_SEQ_GENERATOR", sequenceName="SHOOTER_ID_SEQ" , allocationSize = 1)
    @GeneratedValue(strategy = SEQUENCE, generator="SHOOTER_ID_SEQ_GENERATOR")
    @Column(name = "ID")
    private Integer id;

    @Column (name= "SHOOTER_ID")
    private Integer shooterId;

    @Column(name = "QUESTION_ID")
    private Integer questionId;

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

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
