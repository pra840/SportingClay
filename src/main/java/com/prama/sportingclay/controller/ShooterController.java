package com.prama.sportingclay.controller;

import com.prama.sportingclay.dao.ShooterDAO;
import com.prama.sportingclay.mapper.DomainToBeanMapper;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

/**
 * Created by pmallapur on 6/20/2016.
 */

@Controller
public class ShooterController {

    @Autowired
    private ShooterDAO shooterDAO;

    @Autowired
    private DomainToBeanMapper mapper;

    public ShooterInfoBean getShooterDetails(String shooterName){
        return mapper.mapDomainToBean(shooterDAO.getShooterInformation(shooterName));
    }
}
