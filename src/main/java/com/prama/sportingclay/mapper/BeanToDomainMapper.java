package com.prama.sportingclay.mapper;

import com.prama.sportingclay.domain.Facility;
import org.springframework.stereotype.Component;

import static java.lang.Double.parseDouble;

/**
 * Created by pmallapur on 7/7/2016.
 */
@Component
public class BeanToDomainMapper {

    public static Facility registerFacility(String emailAddress, Long phoneNumber, String lat, String longitude, String facilityName){
        Facility facility = new Facility();
        facility.setFacilityEmail(emailAddress);
        facility.setPhoneNumber(phoneNumber);
        facility.setLatitude(parseDouble(lat));
        facility.setLongitude(parseDouble(longitude));
        facility.setFacilityName(facilityName);
        return facility;
    }
}
