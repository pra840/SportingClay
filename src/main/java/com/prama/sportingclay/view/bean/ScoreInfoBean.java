package com.prama.sportingclay.view.bean;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by pmallapur on 7/13/2016.
 */
public class ScoreInfoBean extends PageDataBean {
    private Integer facilityId;
    private List<ScoreCardBean> scorecard = new ArrayList<>();

    public List<ScoreCardBean> getScorecard() {
        return scorecard;
    }

    public void setScorecard(List<ScoreCardBean> scorecard) {
        this.scorecard = scorecard;
    }
    public Integer getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(Integer facilityId) {
        this.facilityId = facilityId;
    }
}
