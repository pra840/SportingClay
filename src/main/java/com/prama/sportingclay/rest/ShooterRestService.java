package com.prama.sportingclay.rest;

import com.prama.sportingclay.controller.ShooterController;
import com.prama.sportingclay.utility.UserContextProvider;
import com.prama.sportingclay.view.bean.ScoreCardInputBean;
import com.prama.sportingclay.view.bean.ScoresInfoBean;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.QueryParam;

import java.io.IOException;
import java.util.List;

import static com.prama.sportingclay.literals.ApplicationLiterals.applicationRoot;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping(value=applicationRoot)
public class ShooterRestService extends BaseController{

    @Autowired
    private ShooterController shooterController;

    @Autowired
    UserContextProvider userContextProvider;

    @RequestMapping(value = "/shooter/{userName}", method = GET, produces = APPLICATION_JSON_VALUE)
    public ShooterInfoBean getUserDetails(@PathVariable(value="userName") String userName){
        return shooterController.getShooterDetails(userName);
    }

    @RequestMapping(value = "/shooter/id/{userId}", method = GET, produces = APPLICATION_JSON_VALUE)
    public ShooterInfoBean getUserDetailsById(@PathVariable(value="userId") String userId){
        if(StringUtils.isNumericSpace(userId))
            return shooterController.getShooterInfoById(Integer.parseInt(userId));
        return getUserDetails(userId);
    }

    @RequestMapping(value = "/shooter/{userId}/scores", method = GET, produces = APPLICATION_JSON_VALUE)
    public ScoresInfoBean getScores(@PathVariable(value="userId") String userId,
                                   @QueryParam(value = "facilityId") Integer facilityId,
                                   @QueryParam(value = "startDate") String startDate,
                                   @QueryParam(value = "endDate") String endDate){
        Integer userID = getUserId(userId);
        if(userID!= null)
            return shooterController.getScores(userID, facilityId, startDate, endDate);
        return null;
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

    @RequestMapping(value = "/shooter/score", method = POST, produces = APPLICATION_JSON_VALUE)
    public void submitScore(@QueryParam(value="userId") Integer userId,
                           @QueryParam(value= "facilityId") Integer facilityId,
                           ScoreCardInputBean scoreCardInputBean){
        shooterController.submitScore(userId,facilityId,scoreCardInputBean);
    }

    @RequestMapping(value="/users", method = GET, produces = APPLICATION_JSON_VALUE)
    public List<ShooterInfoBean> getAllUsers() {
        return shooterController.getAllShooters();
    }

    @RequestMapping (value = {"/newScore"}, method = GET, produces = APPLICATION_JSON_VALUE)
    public void newScore(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        redirectToPage(SCORECARD_PAGE, request, response);
    }
}
