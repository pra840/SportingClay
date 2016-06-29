package com.prama.sportingclay.mapper;

import com.prama.sportingclay.domain.Auth;
import com.prama.sportingclay.domain.Shooter;
import com.prama.sportingclay.view.bean.UserInfoBean;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;

/**
 * Created by pmallapur on 6/19/2016.
 */
@Component
public class DomainToBeanMapper {

    public static ShooterInfoBean mapDomainToBean(Shooter shooter){
        ShooterInfoBean shooterInfoBean = new ShooterInfoBean();
        shooterInfoBean.setShooterClass(shooter.getShooterClass()!=null? shooter.getShooterClass().getShooterClass(): null);
        shooterInfoBean.setId(shooter.getShooterId());
        shooterInfoBean.setName(shooter.getShooterName());
        shooterInfoBean.setEmailAddress(shooter.getShooterEmailAddress());
        shooterInfoBean.setDateOfBirth(shooter.getDateOfBirth()!=null ? shooter.getDateOfBirth().getTime():null);
        shooterInfoBean.setOccupation(shooter.getOccupation());
        return shooterInfoBean;
    }

    public static UserInfoBean mapDomainToBean(Auth auth){
        UserInfoBean userInfoBean = new UserInfoBean();
        userInfoBean.setId(auth.getShooterId());
        userInfoBean.setPassword(auth.getShooterPass());
//        userInfoBean.setOccupation(auth.getO);
        return userInfoBean;
    }
}
