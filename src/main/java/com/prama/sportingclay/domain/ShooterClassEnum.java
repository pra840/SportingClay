package com.prama.sportingclay.domain;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by pmallapur on 6/19/2016.
 */
public enum ShooterClassEnum {

    CLASS_MASTER(1, "MASTER"),
    CLASS_AA(2, "AA"),
    CLASS_A(3, "A"),
    CLASS_B(4, "B"),
    CLASS_C(5, "C"),
    CLASS_D(6, "D"),
    CLASS_E(7, "E");

    private static final Map<Integer,ShooterClassEnum> lookup = new HashMap<>();

    ShooterClassEnum(Integer shooterClassId, String shooterClass) {
        this.shooterClass = shooterClass;
        this.shooterClassId = shooterClassId;
    }

    public static ShooterClassEnum getShooterClass(Integer shooterClassId){
        return lookup.get(shooterClassId);
    }

    private String shooterClass;

    public Integer getShooterClassId() {
        return shooterClassId;
    }

    private Integer shooterClassId;


    public String getShooterClass() {
        return shooterClass;
    }

    static {
        for(ShooterClassEnum w : EnumSet.allOf(ShooterClassEnum.class))
            lookup.put(w.getShooterClassId(), w);
    }
}
