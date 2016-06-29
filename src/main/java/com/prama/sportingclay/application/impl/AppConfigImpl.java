package com.prama.sportingclay.application.impl;

import com.prama.sportingclay.application.AppConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * Created by pmallapur on 6/28/2016.
 */

@Component
@Scope("singleton")
//@org.springframework.context.annotation.Configuration
//@Profile({"local", "devl"})
public class AppConfigImpl implements AppConfig{

    @Autowired
    private Environment env;

    @Override
    public String getShooterInfoURL() {
        return getProperty("API.Url.ShooterInfo");
    }

    @Override
    public String getBaseURL() {
        return getProperty("API.Base.Url");
    }

    @Override
    public String getServiceUserId() {
        return getProperty("API.UserId");
    }

    @Override
    public String getServicePassword() {
        return getProperty("API.Password");
    }

    public String getProperty(String propertyKey) {
        return env.getProperty(propertyKey);
    }
}
