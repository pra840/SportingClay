package com.prama.sportingclay.mapper;

import com.prama.sportingclay.domain.Auth;
import com.prama.sportingclay.domain.Shooter;
import com.prama.sportingclay.domain.ShooterClassEnum;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import com.prama.sportingclay.view.bean.UserInfoBean;
import org.springframework.stereotype.Component;

/**
 * Created by pmallapur on 6/19/2016.
 */
@Component
public class DomainToBeanMapper {

    public static ShooterInfoBean mapDomainToBean(Shooter shooter){
        ShooterInfoBean shooterInfoBean = new ShooterInfoBean();
        shooterInfoBean.setShooterClass(shooter.getShooterClassId()!=null? ShooterClassEnum.getShooterClass(shooter.getShooterClassId()): null);
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
        return userInfoBean;
    }
}
