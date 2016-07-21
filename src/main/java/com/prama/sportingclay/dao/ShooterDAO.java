package com.prama.sportingclay.dao;

import com.prama.sportingclay.domain.Scorecard;
import com.prama.sportingclay.domain.Shooter;
import com.prama.sportingclay.domain.ShooterScores;
import com.prama.sportingclay.view.bean.ScoresInfoBean;

import java.util.List;

/**
 * Created by pmallapur on 6/19/2016.
 */
public interface ShooterDAO {

    Shooter getShooterInformation(String shooterName);
    Shooter getShooterInfoById(Integer shooterId);
    List<ShooterScores> getShooterScores(Integer userId, String startDate, String endDate);
    List<Scorecard> getScores(List<Integer> scoreCardId);
}
