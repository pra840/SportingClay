package com.prama.sportingclay.view.bean;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Created by pmallapur on 7/7/2016.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FacilityInfoBean extends PageDataBean {

    private String facilityEmail;

    private Long phoneNumber;

    private Double latitude;

    private Double longitude;

    public String getFacilityEmail() {
        return facilityEmail;
    }

    public void setFacilityEmail(String facilityEmail) {
        this.facilityEmail = facilityEmail;
    }

    public Long getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(Long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
