package com.prama.sportingclay.mapper;

import com.prama.sportingclay.domain.Auth;
import com.prama.sportingclay.domain.RoleEnum;
import com.prama.sportingclay.domain.Shooter;
import com.prama.sportingclay.domain.ShooterClassEnum;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

/**
 * Created by pmallapur on 6/29/2016.
 */
public class DomainToBeanMapperTest {

    @Autowired
    DomainToBeanMapper mapper;

    @Test
    public void domainToBeanMapper(){
        ShooterInfoBean shooterInfoBean = mapper.mapDomainToBean(populateDomain(), populateAuth());
        expectedResults(shooterInfoBean);
    }

    private void expectedResults(ShooterInfoBean shooterInfoBean){
        assertNotNull(shooterInfoBean);
        assertEquals(getDate()+"",shooterInfoBean.getDateOfBirth().toString());
        assertEquals("Prasad", shooterInfoBean.getName());
        assertEquals("pra840@gmail.com", shooterInfoBean.getEmailAddress());
        assertEquals(ShooterClassEnum.CLASS_MASTER.getShooterClass(), shooterInfoBean.getShooterClass());
        assertEquals("Java Tech Lead", shooterInfoBean.getOccupation());
        assertEquals(RoleEnum.SUPER_USER.name(), shooterInfoBean.getLoginDataBean().getRole().toUpperCase());
    }

    private Shooter populateDomain(){
        Shooter shooter = new Shooter();
        shooter.setShooterId(1);
        shooter.setShooterName("Prasad");
        shooter.setShooterEmailAddress("pra840@gmail.com");
        shooter.setShooterClassId(1);
        shooter.setPhoneNumber(1234567890L);
        shooter.setOccupation("Java Tech Lead");
        shooter.setDateOfBirth(new java.sql.Timestamp(getDate()));
        return shooter;
    }

    private Auth populateAuth(){
        Auth auth = new Auth();
        auth.setRoleId(3);
        auth.setId(1);
        return auth;
    }

    private long getDate(){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("DD-MM-YYYY");
        try {
            Date date = simpleDateFormat.parse("11-02-1982");
            return date.getTime();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return 0;
    }

}
