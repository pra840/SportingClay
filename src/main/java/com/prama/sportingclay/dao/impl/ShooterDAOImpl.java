package com.prama.sportingclay.dao.impl;

import com.prama.sportingclay.dao.ShooterDAO;
import com.prama.sportingclay.domain.Shooter;
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
    private EntityManager em;

    public Shooter getShooterInformation(String shooterName) {
        Query query = em.createQuery("from Shooter where shooterName = :SHOOTER_NAME ");

        query.setParameter("SHOOTER_NAME", shooterName);

        List<Shooter> shooters = (List<Shooter>) query.getResultList();

        return shooters != null && shooters.size() > 0 ? shooters.get(0) : null;
    }
}
