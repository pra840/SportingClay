package com.prama.sportingclay.authentication;

import com.prama.sportingclay.view.bean.ShooterInfoBean;

/**
 * Created by pmallapur on 6/27/2016.
 */
public class UserContext {
    protected ShooterInfoBean shooterinfo;

    public UserContext(ShooterInfoBean shooterinfo) {
        this.shooterinfo = shooterinfo;
    }

    public ShooterInfoBean getShooterinfo() {
        return shooterinfo;
    }

    public void setShooterinfo(ShooterInfoBean shooterinfo) {
        this.shooterinfo = shooterinfo;
    }
}
