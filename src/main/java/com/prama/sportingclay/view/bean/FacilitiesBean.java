package com.prama.sportingclay.view.bean;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Created by pmallapur on 7/7/2016.
 */

@JsonInclude(JsonInclude.Include.NON_NULL)
public class FacilitiesBean extends PageDataBean {
    private List<FacilityInfoBean> facilityInfoBean;

    public List<FacilityInfoBean> getFacilityInfoBean() {
        return facilityInfoBean;
    }

    public void setFacilityInfoBean(List<FacilityInfoBean> facilityInfoBean) {
        this.facilityInfoBean = facilityInfoBean;
    }
}
