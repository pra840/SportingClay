package com.prama.sportingclay.dao;

import com.prama.sportingclay.domain.Shooter;

/**
 * Created by pmallapur on 6/19/2016.
 */
public interface ShooterDAO {

    Shooter getShooterInformation(String shooterName);
}
