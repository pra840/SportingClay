package com.prama.sportingclay.mapper;

import com.prama.sportingclay.domain.Shooter;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.springframework.stereotype.Component;

/**
 * Created by pmallapur on 6/19/2016.
 */
@Component
public class DomainToBeanMapper {

    public static ShooterInfoBean mapDomainToBean(Shooter shooter){
        ShooterInfoBean shooterInfoBean = new ShooterInfoBean();
        shooterInfoBean.setShooterClass(shooter.getShooterClass().getShooterClass());
        shooterInfoBean.setId(shooter.getShooterId());
        shooterInfoBean.setName(shooter.getShooterName());
        shooterInfoBean.setEmailAddress(shooter.getShooterEmailAddress());
        shooterInfoBean.setDateOfBirth(shooter.getDateOfBirth());
        shooterInfoBean.setOccupation(shooter.getOccupation());
        return shooterInfoBean;
    }
}
