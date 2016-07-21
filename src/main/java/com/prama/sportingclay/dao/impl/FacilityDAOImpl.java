package com.prama.sportingclay.dao.impl;

import com.prama.sportingclay.dao.BaseDAO;
import com.prama.sportingclay.dao.FacilityDAO;
import com.prama.sportingclay.domain.Facility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.apache.commons.lang.StringUtils.isEmpty;

/**
 * Created by pmallapur on 7/7/2016.
 */
@Repository
public class FacilityDAOImpl implements FacilityDAO{
    @Autowired
    BaseDAO baseDAO;

    @PersistenceContext(unitName = "sportingclay")
    @Qualifier("sportingclayEmf")
    private EntityManager emf;

    @Override
    @Transactional
    public void registerFacility(Facility facility) {
        baseDAO.save(facility);
    }

    @Override
    public List<Facility> getFacilities(String emailAddress, Long phoneNumber, String lat, String longitude, String facilityName) {
        List<Facility> facilities = new ArrayList<>();
        if(isEmpty(facilityName)==false)
            facilities.addAll(getFacilityByName(facilityName));
        if(!isEmpty(lat) && !isEmpty(longitude))
            facilities.addAll(getFacilityByLocation(lat, longitude));
        return removeDuplicates(facilities);
    }

    @Override
    public List<Facility> getFacilityByEmail(String emailAddress) {
        Query query = emf.createQuery("from Facility where facilityEmail = :emailAddress");
        query.setParameter("emailAddress", emailAddress);
        List<Facility> facilities = (List<Facility>) query.getResultList();
        return facilities;
    }

    @Override
    public List<Facility> getFacilities() {
        Query query = emf.createQuery("from Facility");
        List<Facility> facilities = (List<Facility>) query.getResultList();
        return facilities;
    }

    @Override
    public Facility getFacility(Integer facilityId) {
        Query query = emf.createQuery("from Facility where facilityId = :facilityId");
        query.setParameter("facilityId", facilityId);
        List<Facility> facilities = (List<Facility>) query.getResultList();
        return CollectionUtils.isEmpty(facilities)?null:facilities.get(0);
    }

    private List<Facility> getFacilityByLocation(String latitude, String longitude){
        Query query = emf.createQuery("from Facility where latitude = :latitude AND longitude = :longitude");
        query.setParameter("latitude", latitude);
        query.setParameter("longitude", longitude);
        List<Facility> facilities = (List<Facility>) query.getResultList();
        return facilities;
    }

    private List<Facility> getFacilityByName(String facilityName){
        Query query = emf.createQuery("from Facility where facilityName = :facilityName");
        query.setParameter("facilityName", facilityName);
        List<Facility> facilities = (List<Facility>) query.getResultList();
        return facilities;
    }
    private List<Facility> removeDuplicates(List<Facility> facilities){
        if(CollectionUtils.isEmpty(facilities))return null;

        Map<Integer, Facility> finalMap = new HashMap<>();

        for(Facility facility: facilities){
            finalMap.put(facility.getFacilityId(), facility);
        }
        return new ArrayList<>(finalMap.values());
    }

}
