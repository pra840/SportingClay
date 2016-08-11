package com.prama.sportingclay.view.bean;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Created by pmallapur on 7/13/2016.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScoresInfoBean {

    private List<ScoreInfoBean> scoreInfoBeanList;

    public List<ScoreInfoBean> getScoreInfoBeanList() {
        return scoreInfoBeanList;
    }

    public void setScoreInfoBeanList(List<ScoreInfoBean> scoreInfoBeanList) {
        this.scoreInfoBeanList = scoreInfoBeanList;
    }
}
