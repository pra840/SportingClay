package com.prama.sportingclay.view.bean;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by pmallapur on 7/13/2016.
 */
public class ScoreInfoBean extends PageDataBean {
    private Integer facilityId;
    private List<ScoreCardBean> scorecard = new ArrayList<>();
    private Integer total;

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

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
