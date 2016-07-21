package com.prama.sportingclay.domain;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by pmallapur on 7/7/2016.
 */
public enum  RoleEnum {

    USER(1, "USER"),
    ADMIN(2, "ADMIN"),
    SUPER_USER(3, "SUPER_USER");

    Integer roleId;
    String role;

    RoleEnum(Integer roleId, String role) {
        this.roleId = roleId;
        this.role = role;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    private static final Map<Integer,String> lookup = new HashMap<>();

    static {
        for(RoleEnum w : EnumSet.allOf(RoleEnum.class))
            lookup.put(w.getRoleId(),w.getRole());
    }

    public static String getRole(Integer roleId){
        return lookup.get(roleId);
    }
}
