package com.prama.sportingclay.rest;

import com.prama.sportingclay.service.FacilityService;
import com.prama.sportingclay.utility.UserContextProvider;
import com.prama.sportingclay.view.bean.FacilitiesBean;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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

    @Autowired
    UserContextProvider userContextProvider;

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
            @PathVariable("facilityName") String facilityName)throws ServletException, IOException, RuntimeException {
        return facilityService.getFacilityDetails(null,null,null,null,facilityName);
    }

    @RequestMapping(value = { "/facilities/{userId}" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public FacilitiesBean getFacilities(@PathVariable("userId") Integer userId) throws ServletException, IOException, RuntimeException {
        return facilityService.getFacilities(userId);
    }

    @RequestMapping(value = { "/facilities" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public FacilitiesBean getFacilities() throws ServletException, IOException, RuntimeException {
        return facilityService.getFacilities(null);
    }

    @RequestMapping (value = {"/userFacilitiesMapView/{userId}"}, method = GET, produces = APPLICATION_JSON_VALUE)
    public void facilitiesMapView(HttpServletRequest request, HttpServletResponse response, @PathVariable("userId") String userId) throws ServletException, IOException {
        Integer userID = getUserId(userId);
        if(userID!= null)response.addCookie(new Cookie("prama-user", userID.toString()));
        redirectToPage(FACILITIES_PAGE, request, response);
    }

    @RequestMapping (value = {"/facilitiesMapView"}, method = GET, produces = APPLICATION_JSON_VALUE)
    public void facilitiesMapView(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        redirectToPage(FACILITIES_PAGE, request, response);
    }

    @RequestMapping (value = {"/newFacility"}, method = GET, produces = APPLICATION_JSON_VALUE)
    public void newFacility(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        redirectToPage(NEW_FACILITY_PAGE, request, response);
    }

    private Integer getUserId(@PathVariable(value = "userId") String userId) {
        Integer userID = null;
        if(StringUtils.isNumericSpace(userId)) {
            userID = Integer.parseInt(userId);
        }else if (userId.contains("@")|| userId.equalsIgnoreCase("undefined")) {
            userID = userContextProvider.getUserContext().getShooterinfo().getId();
        }
        return userID;
    }
}
