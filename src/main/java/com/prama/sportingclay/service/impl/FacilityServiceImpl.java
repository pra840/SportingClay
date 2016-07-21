package com.prama.sportingclay.service.impl;

import com.prama.sportingclay.dao.FacilityDAO;
import com.prama.sportingclay.mapper.BeanToDomainMapper;
import com.prama.sportingclay.mapper.DomainToBeanMapper;
import com.prama.sportingclay.service.FacilityService;
import com.prama.sportingclay.view.bean.FacilitiesBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;

/**
 * Created by pmallapur on 7/7/2016.
 */
@Service
public class FacilityServiceImpl implements FacilityService {

    @Autowired
    FacilityDAO facilityDAO;

    @Override
    public void manageFacility(String emailAddress, Long phoneNumber, String lat, String longitude, String facilityName) {
        facilityDAO.registerFacility(BeanToDomainMapper.registerFacility(emailAddress, phoneNumber, lat, longitude, facilityName));
    }

    @Override
    public FacilitiesBean getFacilityDetails(String emailAddress, Long phoneNumber, String lat, String longitude, String facilityName) {
        return DomainToBeanMapper.mapDomainToBean(facilityDAO.getFacilities(emailAddress, phoneNumber, lat, longitude, facilityName));
    }

    @Override
    public FacilitiesBean getFacilityDetails(Integer facilityId) {
        return DomainToBeanMapper.mapDomainToBean(Arrays.asList(facilityDAO.getFacility(facilityId)));
    }

    @Override
    public FacilitiesBean getFacilities() {
        return DomainToBeanMapper.mapDomainToBean(facilityDAO.getFacilities());
    }
}
