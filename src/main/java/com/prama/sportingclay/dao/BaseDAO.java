package com.prama.sportingclay.dao;

import com.prama.sportingclay.domain.PersistentObject;

/**
 * Created by pmallapur on 7/5/2016.
 */
public interface BaseDAO {
    void save(PersistentObject persistentObject);
    void update(PersistentObject persistentObject);
    void delete(PersistentObject persistentObject);
}
