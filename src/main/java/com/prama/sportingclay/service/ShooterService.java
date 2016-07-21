package com.prama.sportingclay.service;

import com.prama.sportingclay.view.bean.ScoreCardInputBean;
import com.prama.sportingclay.view.bean.ScoresInfoBean;
import com.prama.sportingclay.view.bean.ShooterInfoBean;

/**
 * Created by pmallapur on 7/3/2016.
 */
public interface ShooterService {

    void signup(String shooterName,Long phoneNum,
                String occupation,String dob,
                String shooterClass, String password,
                String emailAddress,String question,
                String answer);

    ShooterInfoBean getShooterInfoById(Integer shooterId);

    ShooterInfoBean getShooterDetails(String userName);

    ScoresInfoBean getScores(Integer userId, Integer facilityId, String startDate, String endDate);

    void submitScore(Integer userId, Integer facilityId,ScoreCardInputBean scoreCardInputBean);
}
