package com.prama.sportingclay.dao.impl;

import com.prama.sportingclay.dao.AuthDAO;
import com.prama.sportingclay.domain.Auth;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.sql.DataSource;
import java.util.List;

/**
 * Created by pmallapur on 6/27/2016.
 */
@Repository
public class AuthDAOImpl implements AuthDAO {

    @Resource(name = "sportingclayDataSource")
    private DataSource dataSource;

    @PersistenceContext(unitName = "sportingclay")
    @Qualifier("sportingclayEmf")
    private EntityManager emf;

    public Auth getAuthenticationInfo(String shooterEmail) {
        Query query = emf.createQuery("from Auth where shooterEmail = :SHOOTER_EMAIL ");

        query.setParameter("SHOOTER_EMAIL", shooterEmail);

        List<Auth> shooters = (List<Auth>) query.getResultList();

        return shooters != null && shooters.size() > 0 ? shooters.get(0) : null;
    }

    @Override
    public Auth getAuthenticationInfo(Integer shooterId) {
        Query query = emf.createQuery("from Auth where shooterId = :SHOOTER_ID ");

        query.setParameter("SHOOTER_ID", shooterId);

        List<Auth> auth = (List<Auth>) query.getResultList();

        return auth != null && auth.size() > 0 ? auth.get(0) : null;

    }
}
