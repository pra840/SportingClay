package com.prama.sportingclay.domain;

import javax.persistence.*;
import java.io.Serializable;

import static javax.persistence.GenerationType.SEQUENCE;

/**
 * Created by pmallapur on 7/7/2016.
 */
@Entity
@Table(name = "FACILITY")
public class Facility extends PersistentObject implements Serializable{

    @Id
    @SequenceGenerator(name="SHOOTER_ID_SEQ_GENERATOR", sequenceName="SHOOTER_ID_SEQ" , allocationSize = 1)
    @GeneratedValue(strategy = SEQUENCE, generator="SHOOTER_ID_SEQ_GENERATOR")
    @Column(name = "FACILITY_ID")
    private Integer facilityId;

    @Column (name = "EMAIL_ADDRESS")
    private String facilityEmail;

    @Column (name = "PHONE_NUM")
    private Long phoneNumber;

    @Column (name = "LATITUDE")
    private Double latitude;

    @Column (name = "LONGITUDE")
    private Double longitude;

    @Column (name = "FACILITY_NAME")
    private String facilityName;

    public String getFacilityName() {
        return facilityName;
    }

    public void setFacilityName(String facilityName) {
        this.facilityName = facilityName;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Long getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(Long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getFacilityEmail() {
        return facilityEmail;
    }

    public void setFacilityEmail(String facilityEmail) {
        this.facilityEmail = facilityEmail;
    }

    public Integer getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(Integer facilityId) {
        this.facilityId = facilityId;
    }
}
