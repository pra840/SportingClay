package com.prama.sportingclay.service.impl;

import com.prama.sportingclay.dao.FacilityDAO;
import com.prama.sportingclay.dao.ShooterDAO;
import com.prama.sportingclay.domain.Facility;
import com.prama.sportingclay.domain.ShooterScores;
import com.prama.sportingclay.mapper.BeanToDomainMapper;
import com.prama.sportingclay.service.FacilityService;
import com.prama.sportingclay.view.bean.FacilitiesBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.prama.sportingclay.mapper.DomainToBeanMapper.mapDomainToBean;

/**
 * Created by pmallapur on 7/7/2016.
 */
@Service
public class FacilityServiceImpl implements FacilityService {

    @Autowired
    FacilityDAO facilityDAO;

    @Autowired
    ShooterDAO shooterDAO;

    @Override
    public void manageFacility(String emailAddress, Long phoneNumber, String lat, String longitude, String facilityName) {
        facilityDAO.registerFacility(BeanToDomainMapper.registerFacility(emailAddress, phoneNumber, lat, longitude, facilityName));
    }

    @Override
    public FacilitiesBean getFacilityDetails(String emailAddress, Long phoneNumber, String lat, String longitude, String facilityName) {
        return mapDomainToBean(facilityDAO.getFacilities(emailAddress, phoneNumber, lat, longitude, facilityName));
    }

    @Override
    public FacilitiesBean getFacilityDetails(Integer facilityId) {
        return mapDomainToBean(Arrays.asList(facilityDAO.getFacility(facilityId)));
    }

    @Override
    public FacilitiesBean getFacilities(Integer userId) {
        List<Integer> facilityIds = null;
        if(userId!=null) {
            List<ShooterScores> shooterScores = shooterDAO.getShooterScores(userId, null, null);
            if (!CollectionUtils.isEmpty(shooterScores)) {
                facilityIds = shooterScores.stream().map(ShooterScores::getFacilityId).collect(Collectors.toList());
            }
        }
        return mapDomainToBean(facilityDAO.getFacilities(facilityIds));
    }
}
