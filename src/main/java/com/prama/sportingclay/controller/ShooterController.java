package com.prama.sportingclay.controller;

import com.prama.sportingclay.service.ShooterService;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

/**
 * Created by pmallapur on 6/20/2016.
 */

@Controller
public class ShooterController {

    @Autowired
    private ShooterService shooterService;

    public ShooterInfoBean getShooterDetails(String shooterName){
        return shooterService.getShooterDetails(shooterName);
    }

    public ShooterInfoBean getShooterInfoById(Integer userId) {
        return shooterService.getShooterInfoById(userId);
    }
}
