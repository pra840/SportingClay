package com.prama.sportingclay.view.bean;

import javax.ws.rs.QueryParam;

/**
 * Created by pmallapur on 7/14/2016.
 */
public class ScoreCardInputBean {

    @QueryParam(value = "station1") String station1;
    @QueryParam(value = "station2") String station2;
    @QueryParam(value = "station3") String station3;
    @QueryParam(value = "station4") String station4;
    @QueryParam(value = "station5") String station5;
    @QueryParam(value = "station6") String station6;
    @QueryParam(value = "station7") String station7;
    @QueryParam(value = "station8") String station8;
    @QueryParam(value = "station8") String station9;
    @QueryParam(value = "station10") String station10;
    @QueryParam(value = "station11") String station11;
    @QueryParam(value = "station12") String station12;
    @QueryParam(value = "station13") String station13;
    @QueryParam(value = "station14") String station14;
    @QueryParam(value = "station15") String station15;
    @QueryParam(value = "outOfScore") Integer outOfScore;
    @QueryParam(value = "total") Integer total;

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Integer getOutOfScore() {
        return outOfScore;
    }

    public void setOutOfScore(Integer outOfScore) {
        this.outOfScore = outOfScore;
    }


    public String getStation1() {
        return station1;
    }

    public void setStation1(String station1) {
        this.station1 = station1;
    }

    public String getStation2() {
        return station2;
    }

    public void setStation2(String station2) {
        this.station2 = station2;
    }

    public String getStation3() {
        return station3;
    }

    public void setStation3(String station3) {
        this.station3 = station3;
    }

    public String getStation4() {
        return station4;
    }

    public void setStation4(String station4) {
        this.station4 = station4;
    }

    public String getStation5() {
        return station5;
    }

    public void setStation5(String station5) {
        this.station5 = station5;
    }

    public String getStation6() {
        return station6;
    }

    public void setStation6(String station6) {
        this.station6 = station6;
    }

    public String getStation7() {
        return station7;
    }

    public void setStation7(String station7) {
        this.station7 = station7;
    }

    public String getStation8() {
        return station8;
    }

    public void setStation8(String station8) {
        this.station8 = station8;
    }

    public String getStation9() {
        return station9;
    }

    public void setStation9(String station9) {
        this.station9 = station9;
    }

    public String getStation10() {
        return station10;
    }

    public void setStation10(String station10) {
        this.station10 = station10;
    }

    public String getStation11() {
        return station11;
    }

    public void setStation11(String station11) {
        this.station11 = station11;
    }

    public String getStation12() {
        return station12;
    }

    public void setStation12(String station12) {
        this.station12 = station12;
    }

    public String getStation13() {
        return station13;
    }

    public void setStation13(String station13) {
        this.station13 = station13;
    }

    public String getStation14() {
        return station14;
    }

    public void setStation14(String station14) {
        this.station14 = station14;
    }

    public String getStation15() {
        return station15;
    }

    public void setStation15(String station15) {
        this.station15 = station15;
    }
}
