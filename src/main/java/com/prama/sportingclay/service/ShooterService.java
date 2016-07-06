package com.prama.sportingclay.service;

import com.prama.sportingclay.view.bean.ShooterInfoBean;

/**
 * Created by pmallapur on 7/3/2016.
 */
public interface ShooterService {

    void signup(String shooterName,Integer phoneNum,
                String occupation,String dob,
                String shooterClass, String password,
                String emailAddress,String question,
                String answer);

    ShooterInfoBean getShooterInfoById(Integer shooterId);

    ShooterInfoBean getShooterDetails(String userName);
}
