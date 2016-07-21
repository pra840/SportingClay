package com.prama.sportingclay.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

import static javax.persistence.GenerationType.SEQUENCE;

/**
 * Created by pmallapur on 7/7/2016.
 */
@Entity
@Table(name = "SHOOTER_SCORES")
public class ShooterScores extends PersistentObject implements Serializable {

    @Id
    @SequenceGenerator(name="SHOOTER_ID_SEQ_GENERATOR", sequenceName="SHOOTER_ID_SEQ" , allocationSize = 1)
    @GeneratedValue(strategy = SEQUENCE, generator="SHOOTER_ID_SEQ_GENERATOR")
    @Column(name = "ID")
    private Integer id;

    @Column (name = "SHOOTER_ID")
    private Integer shooterId;

    @Column (name = "FACILITY_ID")
    private Integer facilityId;

    @Column (name = "SCORECARD_ID")
    private Integer scorecardId;

    @Column (name = "GAME_DATE")
    private Timestamp gameDate;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getShooterId() {
        return shooterId;
    }

    public void setShooterId(Integer shooterId) {
        this.shooterId = shooterId;
    }

    public Integer getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(Integer facilityId) {
        this.facilityId = facilityId;
    }

    public Integer getScorecardId() {
        return scorecardId;
    }

    public void setScorecardId(Integer scorecardId) {
        this.scorecardId = scorecardId;
    }

    public Timestamp getGameDate() {
        return gameDate;
    }

    public void setGameDate(Timestamp gameDate) {
        this.gameDate = gameDate;
    }
}
