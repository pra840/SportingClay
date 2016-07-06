package com.prama.sportingclay.dao.impl;

import com.prama.sportingclay.dao.ShooterDAO;
import com.prama.sportingclay.domain.Shooter;
import com.prama.sportingclay.utility.CommonMethods;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.sql.DataSource;
import java.util.List;

/**
 * Created by pmallapur on 6/19/2016.
 */

@Repository
public class ShooterDAOImpl implements ShooterDAO {

    @Resource(name = "sportingclayDataSource")
    private DataSource dataSource;

    @PersistenceContext(unitName = "sportingclay")
    @Qualifier("sportingclayEmf")
    private EntityManager emf;

    @Resource
    CommonMethods commonMethods;

    @Override
    public Shooter getShooterInformation(String shooterName) {
        String shooterNm = commonMethods.removeLastCharacter(shooterName);
        if(commonMethods.isEmail(shooterNm)){
            return getShooterInfoByEmail(shooterNm);
        }
        return getShooterInfoByName(shooterNm);
    }

    private Shooter getShooterInfoByEmail(String shooterEmailAddress){
        Query query = emf.createQuery("from Shooter where shooterEmailAddress = :EMAIL_ADDRESS ");
        query.setParameter("EMAIL_ADDRESS", shooterEmailAddress);
        List<Shooter> shooters = (List<Shooter>) query.getResultList();
        return shooters != null && shooters.size() > 0 ? shooters.get(0) : null;
    }

    private Shooter getShooterInfoByName(String shooterName){
        Query query = emf.createQuery("from Shooter where shooterName = :SHOOTER_NAME ");
        query.setParameter("SHOOTER_NAME", shooterName);
        List<Shooter> shooters = (List<Shooter>) query.getResultList();
        return shooters != null && shooters.size() > 0 ? shooters.get(0) : null;
    }

    @Override
    public Shooter getShooterInfoById(Integer shooterId){
        Query query = emf.createQuery("from Shooter where shooterId = :SHOOTER_ID ");
        query.setParameter("SHOOTER_ID", shooterId);
        List<Shooter> shooters = (List<Shooter>) query.getResultList();
        return shooters != null && shooters.size() > 0 ? shooters.get(0) : null;
    }
}
