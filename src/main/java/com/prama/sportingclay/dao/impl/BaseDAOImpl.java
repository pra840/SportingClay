package com.prama.sportingclay.dao.impl;

import com.prama.sportingclay.dao.BaseDAO;
import com.prama.sportingclay.domain.PersistentObject;
import com.prama.sportingclay.domain.Shooter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Created by pmallapur on 7/5/2016.
 */
@Repository
public class BaseDAOImpl implements BaseDAO{

    @PersistenceContext(unitName = "sportingclay")
    @Qualifier("sportingclayEmf")
    private EntityManager emf;

    @Override
    public void save(PersistentObject object) {
        emf.persist(object);
        emf.flush();
        emf.refresh(object);
    }

    @Override
    public void update(PersistentObject object) {
        emf.merge(object);
    }

    @Override
    public void delete(PersistentObject object) {
        emf.remove(object);
    }
}
