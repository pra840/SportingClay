package com.prama.sportingclay.controller;

import com.prama.sportingclay.dao.AuthDAO;
import com.prama.sportingclay.mapper.DomainToBeanMapper;
import com.prama.sportingclay.view.bean.UserInfoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

/**
 * Created by pmallapur on 6/27/2016.
 */

@Controller
public class AuthController {

    @Autowired
    private AuthDAO authDAO;

    @Autowired
    private DomainToBeanMapper mapper;
//
//    public UserInfoBean getAuthInfo(String userId){
//        return mapper.mapDomainToBean(authDAO.getAuthenticationInfo(userId));
//    }
}
