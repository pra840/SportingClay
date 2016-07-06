package com.prama.sportingclay.rest;

import com.prama.sportingclay.controller.ShooterController;
import com.prama.sportingclay.service.ShooterService;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.prama.sportingclay.literals.ApplicationLiterals.applicationRoot;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
@RequestMapping(value=applicationRoot)
public class ShooterRestService {

    @Autowired
    private ShooterService shooterService;

    @Autowired
    private ShooterController shooterController;

    @RequestMapping(value = "/shooter/{userName}", method = GET, produces = APPLICATION_JSON_VALUE)
    public ShooterInfoBean getUserDetails(@PathVariable(value="userName") String userName){
        return shooterController.getShooterDetails(userName);
    }

    @RequestMapping(value = "/shooter/{userId}", method = GET, produces = APPLICATION_JSON_VALUE)
    public ShooterInfoBean getUserDetailsById(@PathVariable(value="userId") Integer userId){
        return shooterController.getShooterInfoById(userId);
    }
}
