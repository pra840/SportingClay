package com.prama.sportingclay.service;

import com.prama.sportingclay.view.bean.FacilitiesBean;
import com.prama.sportingclay.view.bean.FacilityInfoBean;

/**
 * Created by pmallapur on 7/7/2016.
 */
public interface FacilityService {

    void manageFacility(String emailAddress, Long phoneNumber,String lat, String longitude, String facilityName);
    FacilitiesBean getFacilityDetails(String emailAddress, Long phoneNumber, String lat, String longitude, String facilityName);
    FacilitiesBean getFacilityDetails(Integer facilityId);
    FacilitiesBean getFacilities(Integer userId);
}
