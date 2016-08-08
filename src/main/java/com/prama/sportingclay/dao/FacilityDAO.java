package com.prama.sportingclay.dao;

import com.prama.sportingclay.domain.Facility;

import java.util.List;

/**
 * Created by pmallapur on 7/7/2016.
 */
public interface FacilityDAO {
    void registerFacility(Facility facility);
    List<Facility> getFacilities(String emailAddress, Long phoneNumber,String lat, String longitude, String facilityName);
    List<Facility> getFacilityByEmail(String emailAddress);
    List<Facility> getFacilities(List<Integer> facilityIds);
    Facility getFacility(Integer facilityId);
}
