package com.prama.sportingclay.dao;

import com.prama.sportingclay.domain.Auth;

/**
 * Created by pmallapur on 6/27/2016.
 */
public interface AuthDAO {

    Auth getAuthenticationInfo(String email);
    Auth getAuthenticationInfo(Integer shooterId);
}
