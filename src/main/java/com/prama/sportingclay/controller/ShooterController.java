package com.prama.sportingclay.controller;

import com.prama.sportingclay.service.ShooterService;
import com.prama.sportingclay.view.bean.ScoreCardInputBean;
import com.prama.sportingclay.view.bean.ScoresInfoBean;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.util.List;

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

    public ScoresInfoBean getScores(Integer userId, Integer facilityId, String startDate, String endDate){
        return shooterService.getScores(userId, facilityId, startDate, endDate);
    }

    public void submitScore(Integer userId, Integer facilityId, ScoreCardInputBean scoreCardInputBean){
        shooterService.submitScore(userId, facilityId, scoreCardInputBean);
    }

    public List<ShooterInfoBean> getAllShooters(){
        return shooterService.getShooters();
    }
}
