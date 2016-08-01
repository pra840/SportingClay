package com.prama.sportingclay.view.bean;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Created by pmallapur on 7/13/2016.
 */
public class ScoresInfoBean {

    private List<ScoreInfoBean> scoreInfoBeanList;
    private Integer totalScore;

    public Integer getOutOfScore() {
        return outOfScore;
    }

    public void setOutOfScore(Integer outOfScore) {
        this.outOfScore = outOfScore;
    }

    private Integer outOfScore;

    public List<ScoreInfoBean> getScoreInfoBeanList() {
        return scoreInfoBeanList;
    }

    public void setScoreInfoBeanList(List<ScoreInfoBean> scoreInfoBeanList) {
        this.scoreInfoBeanList = scoreInfoBeanList;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }
}
