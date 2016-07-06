package com.prama.sportingclay.domain;

import javax.persistence.*;
import java.io.Serializable;

import static javax.persistence.GenerationType.SEQUENCE;

/**
 * Created by pmallapur on 6/27/2016.
 */

@Entity
@Table(name = "QUESTION")
public class Question extends PersistentObject implements Serializable{
    @Id
    @Column(name ="QUESTION_ID")
    @SequenceGenerator(name="SHOOTER_ID_SEQ_GENERATOR", sequenceName="SHOOTER_ID_SEQ" , allocationSize = 1)
    @GeneratedValue(strategy = SEQUENCE, generator="SHOOTER_ID_SEQ_GENERATOR")
    private Integer questionId;

    @Column (name = "QUESTION")
    private String question;

    @Column (name = "ANSWER")
    private String answer;

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

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }
}
