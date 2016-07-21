package com.prama.sportingclay.domain;

import javax.persistence.*;
import java.io.Serializable;

import static javax.persistence.GenerationType.SEQUENCE;

/**
 * Created by pmallapur on 7/7/2016.
 */
@Entity
@Table(name = "SCORECARD")
public class Scorecard extends PersistentObject implements Serializable {

    @Id
    @SequenceGenerator(name="SHOOTER_ID_SEQ_GENERATOR", sequenceName="SHOOTER_ID_SEQ" , allocationSize = 1)
    @GeneratedValue(strategy = SEQUENCE, generator="SHOOTER_ID_SEQ_GENERATOR")
    @Column(name = "SCORECARD_ID")
    private Integer scorecardId;

    @Column (name = "STATION_TARGET_SCORE")
    private String station_target_score;

    @Column (name = "STATION_TOTAL")
    private String stationTotal;

    @Column (name = "TOTAL_SCORE")
    private Integer totalScore;

    @Column (name = "OUT_OF_SCORE")
    private Integer outOfScore;

    public String getStationTotal() {
        return stationTotal;
    }

    public void setStationTotal(String stationTotal) {
        this.stationTotal = stationTotal;
    }

    public Integer getOutOfScore() {
        return outOfScore;
    }

    public void setOutOfScore(Integer outOfScore) {
        this.outOfScore = outOfScore;
    }

    public String getStation_Target_Score() {
        return station_target_score;
    }

    public void setStation_Target_Score(String station_target_score) {
        this.station_target_score = station_target_score;
    }

    public Integer getScorecardId() {
        return scorecardId;
    }

    public void setScorecardId(Integer scorecardId) {
        this.scorecardId = scorecardId;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }
}
