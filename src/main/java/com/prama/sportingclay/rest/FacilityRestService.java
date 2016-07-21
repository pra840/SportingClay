package com.prama.sportingclay.rest;

import com.prama.sportingclay.service.FacilityService;
import com.prama.sportingclay.view.bean.FacilitiesBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import java.io.IOException;

import static com.prama.sportingclay.literals.ApplicationLiterals.applicationRoot;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by pmallapur on 7/7/2016.
 */
@RestController
@RequestMapping(value = {applicationRoot})
public class FacilityRestService extends BaseController{
    @Autowired
    FacilityService facilityService;

    @RequestMapping(value = { "/facility" }, method = POST, produces = APPLICATION_JSON_VALUE)
    public void manageFacility(@QueryParam("emailAddress") String emailAddress,
                               @QueryParam("phoneNumber") Long phoneNumber,
                               @QueryParam("latitude") String latitude,
                               @QueryParam("longitude") String longitude,
                               @QueryParam("facilityName") String facilityName) throws ServletException, IOException, RuntimeException {
        facilityService.manageFacility(emailAddress, phoneNumber, latitude, longitude, facilityName);
    }

    @RequestMapping(value = { "/facility" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public FacilitiesBean getFacilityDetails(@QueryParam("emailAddress") String emailAddress,
                                             @QueryParam("phoneNumber") Long phoneNumber,
                                             @QueryParam("lat") String lat,
                                             @QueryParam("longitude") String longitude,
                                             @QueryParam("facilityName") String facilityName) throws ServletException, IOException, RuntimeException {
        return facilityService.getFacilityDetails(emailAddress, phoneNumber, lat, longitude, facilityName);
    }

    @RequestMapping(value = { "/facility/{facilityName}" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public FacilitiesBean getFacility(
            //HttpServletRequest request, HttpServletResponse response
            @PathVariable("facilityName") String facilityName
    )
            throws ServletException, IOException, RuntimeException {

        return facilityService.getFacilityDetails(null,null,null,null,facilityName);
    }

    @RequestMapping(value = { "/facilities" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public FacilitiesBean getFacilities() throws ServletException, IOException, RuntimeException {
        return facilityService.getFacilities();
    }
}
