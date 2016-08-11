package com.prama.sportingclay.view.bean;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by pmallapur on 7/13/2016.
 */
public class ScoreInfoBean extends PageDataBean {

    private Integer facilityId;
    private Date gameDate;
    private Integer totalScore;
    private Integer outOfScore;
    private List<ScoreCardBean> scorecard = new ArrayList<>();

    public Integer getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(Integer facilityId) {
        this.facilityId = facilityId;
    }

    public Date getGameDate() {
        return gameDate;
    }

    public void setGameDate(Date gameDate) {
        this.gameDate = gameDate;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public Integer getOutOfScore() {
        return outOfScore;
    }

    public void setOutOfScore(Integer outOfScore) {
        this.outOfScore = outOfScore;
    }

    public List<ScoreCardBean> getScorecard() {
        return scorecard;
    }

    public void setScorecard(List<ScoreCardBean> scorecard) {
        this.scorecard = scorecard;
    }
}
