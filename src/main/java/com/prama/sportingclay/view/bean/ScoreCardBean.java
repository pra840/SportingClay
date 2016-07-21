package com.prama.sportingclay.view.bean;

/**
 * Created by pmallapur on 7/13/2016.
 */
public class ScoreCardBean {

    private Integer station;
    private Integer target;
    private String score;

    public ScoreCardBean(Integer station, Integer target, String score) {
        this.station = station;
        this.target = target;
        this.score = score;
    }

    public Integer getStation() {
        return station;
    }

    public void setStation(Integer station) {
        this.station = station;
    }

    public Integer getTarget() {
        return target;
    }

    public void setTarget(Integer target) {
        this.target = target;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }
}
