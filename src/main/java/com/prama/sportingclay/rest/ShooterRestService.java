package com.prama.sportingclay.rest;

import com.prama.sportingclay.controller.ShooterController;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
public class ShooterRestService {

    @Autowired
    private ShooterController shooterController;

    @RequestMapping(value = "/shooter/{userName}", produces = APPLICATION_JSON_VALUE)
        public ShooterInfoBean getUserDetails(@PathVariable(value="userName") String userName){
        return shooterController.getShooterDetails(userName);
    }
}
