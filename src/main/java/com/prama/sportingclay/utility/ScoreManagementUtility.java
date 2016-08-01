package com.prama.sportingclay.utility;

import com.prama.sportingclay.view.bean.ScoreCardInputBean;
import org.springframework.stereotype.Component;

import static java.lang.Integer.parseInt;
import static org.springframework.util.StringUtils.isEmpty;

/**
 * Created by pmallapur on 7/15/2016.
 */
@Component
public class ScoreManagementUtility {

    public static String getStationTargetScore(ScoreCardInputBean scoreCardInputBean) {
        StringBuilder sbStationTargetScore = new StringBuilder();
        String station1 = getScoreByStation(1, scoreCardInputBean.getStation1());
        if(station1!=null)sbStationTargetScore.append(station1);
        String station2 = getScoreByStation(2, scoreCardInputBean.getStation2());
        if(station2!=null)sbStationTargetScore.append(","+station2);
        String station3 = getScoreByStation(3, scoreCardInputBean.getStation3());
        if(station3!=null)sbStationTargetScore.append(","+station3);
        String station4 = getScoreByStation(4, scoreCardInputBean.getStation4());
        if(station4!=null)sbStationTargetScore.append(","+station4);
        String station5 = getScoreByStation(5, scoreCardInputBean.getStation5());
        if(station5!=null)sbStationTargetScore.append(","+station5);
        String station6 = getScoreByStation(6, scoreCardInputBean.getStation6());
        if(station6!=null)sbStationTargetScore.append(","+station6);
        String station7 = getScoreByStation(7, scoreCardInputBean.getStation7());
        if(station7!=null)sbStationTargetScore.append(","+station7);
        String station8 = getScoreByStation(8, scoreCardInputBean.getStation8());
        if(station8!=null)sbStationTargetScore.append(","+station8);
        String station9 = getScoreByStation(9, scoreCardInputBean.getStation9());
        if(station9!=null)sbStationTargetScore.append(","+station9);
        String station10 = getScoreByStation(10, scoreCardInputBean.getStation10());
        if(station10!=null)sbStationTargetScore.append(","+station10);
        String station11 = getScoreByStation(11, scoreCardInputBean.getStation11());
        if(station11!=null)sbStationTargetScore.append(","+station11);
        String station12 = getScoreByStation(12, scoreCardInputBean.getStation12());
        if(station12!=null)sbStationTargetScore.append(","+station12);
        String station13 = getScoreByStation(13, scoreCardInputBean.getStation13());
        if(station13!=null)sbStationTargetScore.append(","+station13);
        String station14 = getScoreByStation(14, scoreCardInputBean.getStation14());
        if(station14!=null)sbStationTargetScore.append(","+station14);
        String station15 = getScoreByStation(15, scoreCardInputBean.getStation15());
        if(station15!=null)sbStationTargetScore.append(","+station15);

        return sbStationTargetScore.toString();
    }

    public static String getStationTotal(ScoreCardInputBean scoreCardInputBean) {
        StringBuilder sbStationTotal = new StringBuilder();
        String station1 = getTotalByTarget(1, scoreCardInputBean.getStation1());
        if(station1!=null)sbStationTotal.append(station1);
        String station2 = getTotalByTarget(2, scoreCardInputBean.getStation2());
        if(station2!=null)sbStationTotal.append(","+station2);
        String station3 = getTotalByTarget(3, scoreCardInputBean.getStation3());
        if(station3!=null)sbStationTotal.append(","+station3);
        String station4 = getTotalByTarget(4, scoreCardInputBean.getStation4());
        if(station4!=null)sbStationTotal.append(","+station4);
        String station5 = getTotalByTarget(5, scoreCardInputBean.getStation5());
        if(station5!=null)sbStationTotal.append(","+station5);
        String station6 = getTotalByTarget(6, scoreCardInputBean.getStation6());
        if(station6!=null)sbStationTotal.append(","+station6);
        String station7 = getTotalByTarget(7, scoreCardInputBean.getStation7());
        if(station7!=null)sbStationTotal.append(","+station7);
        String station8 = getTotalByTarget(8, scoreCardInputBean.getStation8());
        if(station8!=null)sbStationTotal.append(","+station8);
        String station9 = getTotalByTarget(9, scoreCardInputBean.getStation9());
        if(station9!=null)sbStationTotal.append(","+station9);
        String station10 = getTotalByTarget(10, scoreCardInputBean.getStation10());
        if(station10!=null)sbStationTotal.append(","+station10);
        String station11 = getTotalByTarget(11, scoreCardInputBean.getStation11());
        if(station11!=null)sbStationTotal.append(","+station11);
        String station12 = getTotalByTarget(12, scoreCardInputBean.getStation12());
        if(station12!=null)sbStationTotal.append(","+station12);
        String station13 = getTotalByTarget(13, scoreCardInputBean.getStation13());
        if(station13!=null)sbStationTotal.append(","+station13);
        String station14 = getTotalByTarget(14, scoreCardInputBean.getStation14());
        if(station14!=null)sbStationTotal.append(","+station14);
        String station15 = getTotalByTarget(15, scoreCardInputBean.getStation15());
        if(station15!=null)sbStationTotal.append(","+station15);

        return sbStationTotal.toString();
    }

    public static String getTotalByTarget(Integer stationId, String station){
        Integer stationTotalScore = 0;
        if(!isEmpty(station)) {
            String[]stationScore = station.split(",");
            for(int i = 0; i<stationScore.length; i++){
                stationTotalScore += parseInt(stationScore[i].split("-")[1]);
            }
            return stationId+"-"+stationTotalScore;
        }
        return null;
    }

    public static String getScoreByStation(Integer stationId,String stationTargetScore){
        StringBuilder sbStationTargetScore = new StringBuilder();
        if(!isEmpty(stationTargetScore)) {
            String[]stationScore = stationTargetScore.split(",");
            String postFix = ",";
            for(int i = 0; i<stationScore.length; i++){
                sbStationTargetScore.append(stationId+"-"+stationScore[i]);
                if(i==(stationScore.length-1))postFix ="";
                sbStationTargetScore.append(postFix);
            }
            return sbStationTargetScore.toString();
        }
        return null;
    }

    public static Integer getTotalScore(ScoreCardInputBean scoreCardInputBean){
        if(scoreCardInputBean.getTotal()!=null)
            return scoreCardInputBean.getTotal();
        return (getScore(scoreCardInputBean.getStation1())
                +getScore(scoreCardInputBean.getStation2())
                +getScore(scoreCardInputBean.getStation3())
                +getScore(scoreCardInputBean.getStation4())
                +getScore(scoreCardInputBean.getStation5())
                +getScore(scoreCardInputBean.getStation6())
                +getScore(scoreCardInputBean.getStation7())
                +getScore(scoreCardInputBean.getStation8())
                +getScore(scoreCardInputBean.getStation9())
                +getScore(scoreCardInputBean.getStation10())
                +getScore(scoreCardInputBean.getStation11())
                +getScore(scoreCardInputBean.getStation12())
                +getScore(scoreCardInputBean.getStation13())
                +getScore(scoreCardInputBean.getStation14())
                +getScore(scoreCardInputBean.getStation15()));
    }

    private static Integer getScore(String station){
        if (isEmpty(station))return 0;
        Integer totalScore = 0;

        String[]stationScore = station.split(",");
        for(int i = 0; i<stationScore.length; i++){
            totalScore += parseInt(stationScore[i].split("-")[1]);
        }
        return totalScore;

    }
}
