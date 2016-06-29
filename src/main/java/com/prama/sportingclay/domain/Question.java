package com.prama.sportingclay.domain;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by pmallapur on 6/27/2016.
 */

@Entity
@Table(name = "QUESTION")
public class Question implements Serializable{

    @Column (name = "QUESTION")
    private String question;

    @Column (name = "ANSWER")
    private String answer;

    @Id
    @OneToOne
    @JoinColumn(name = "QUESTION_ID")
    private SignUpInfo questionId;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public SignUpInfo getSignUpInfo() {
        return questionId;
    }

    public void setSignUpInfo(SignUpInfo signUpInfo) {
        this.questionId = signUpInfo;
    }
}
