package com.prama.sportingclay.mapper;

import com.prama.sportingclay.domain.*;
import com.prama.sportingclay.view.bean.*;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.lang.Integer.parseInt;

/**
 * Created by pmallapur on 6/19/2016.
 */
@Component
public class DomainToBeanMapper {

    public static ShooterInfoBean mapDomainToBean(Shooter shooter, Auth auth){
        ShooterInfoBean shooterInfoBean = new ShooterInfoBean();
        if(shooter==null)return shooterInfoBean;
        shooterInfoBean.setShooterClass(shooter.getShooterClassId()!=null? ShooterClassEnum.getShooterClass(shooter.getShooterClassId()): null);
        shooterInfoBean.setId(shooter.getShooterId());
        shooterInfoBean.setName(shooter.getShooterName());
        shooterInfoBean.setEmailAddress(shooter.getShooterEmailAddress());
        shooterInfoBean.setDateOfBirth(shooter.getDateOfBirth()!=null ? shooter.getDateOfBirth().getTime():null);
        shooterInfoBean.setOccupation(shooter.getOccupation());

        if(auth!=null)
            shooterInfoBean.setLoginDataBean(mapLoginDataBean(auth));
        return shooterInfoBean;
    }

    public static List<ShooterInfoBean> mapDomainToShootersBean(List<Shooter> shooters){
        List<ShooterInfoBean> shootersInfoBean = new ArrayList<ShooterInfoBean>();
        if(shooters==null||shooters.isEmpty())return shootersInfoBean;
        shootersInfoBean.addAll(shooters.stream().map(shooter -> mapDomainToBean(shooter, null)).collect(Collectors.toList()));
        return shootersInfoBean;
    }

    private static LoginDataBean mapLoginDataBean(Auth auth) {
        LoginDataBean loginDataBean = new LoginDataBean();
        loginDataBean.setId(auth.getId());
        loginDataBean.setRole(RoleEnum.getRole(auth.getRoleId()));
        return loginDataBean;
    }

    public static FacilitiesBean mapDomainToBean(List<Facility> facilities) {

        FacilitiesBean facilitiesBean = new FacilitiesBean();
        if(CollectionUtils.isEmpty(facilities))return facilitiesBean;
        FacilityInfoBean facilityInfoBean;
        for(Facility facility: facilities){
            facilityInfoBean = new FacilityInfoBean();
            facilityInfoBean.setFacilityEmail(facility.getFacilityEmail());
            facilityInfoBean.setLongitude(facility.getLongitude());
            facilityInfoBean.setLatitude(facility.getLatitude());
            facilityInfoBean.setPhoneNumber(facility.getPhoneNumber());
            facilityInfoBean.setId(facility.getFacilityId());
            facilityInfoBean.setName(facility.getFacilityName());
            if(facilitiesBean.getFacilityInfoBean()==null)
                facilitiesBean.setFacilityInfoBean(new ArrayList<>());
            facilitiesBean.getFacilityInfoBean().add(facilityInfoBean);
        }
        return facilitiesBean;
    }

    public ScoresInfoBean mapDomainToBean(List<ShooterScores> scores, List<Scorecard> scorecards) {

        ScoresInfoBean scoresInfoBean = new ScoresInfoBean();
        List<ScoreInfoBean> scoreInfoBeanList = new ArrayList<>();

        for(Scorecard scorecard:scorecards) {
            ScoreInfoBean scoreInfoBean = new ScoreInfoBean();
            scoreInfoBean.setId(scorecard.getScorecardId());
            scoreInfoBean.setScorecard(getScoreCardBean(scorecard));
            scoreInfoBean.setFacilityId(getFacilityDetails(scorecard.getScorecardId(), scores));
            scoreInfoBeanList.add(scoreInfoBean);
            if (scoresInfoBean.getOutOfScore()==null) scoresInfoBean.setOutOfScore(scorecard.getOutOfScore());
            if (scoresInfoBean.getTotalScore()==null) scoresInfoBean.setTotalScore(scorecard.getTotalScore());
            scoresInfoBean.setScoreInfoBeanList(scoreInfoBeanList);
        }
        return scoresInfoBean;
    }

    private Integer getFacilityDetails(Integer scorecardId, List<ShooterScores> scores) {
        scores.stream().filter(shooterScores -> shooterScores.getScorecardId().equals(scorecardId)).forEach(ShooterScores::getFacilityId);
        return null;
    }

    private List<ScoreCardBean> getScoreCardBean(Scorecard scorecard){
        String station_target_score = scorecard.getStation_Target_Score();
        List<ScoreCardBean> scoreCardBeanList = new ArrayList<>();
        String[] allScores= StringUtils.split(station_target_score, ",");
        for(int i=0; i<allScores.length; i++ ) {
            String[] indvScore = allScores[i].split("-");
            Integer stationId = parseInt(indvScore[0]);
            ScoreCardBean cardBean = new ScoreCardBean(parseInt(indvScore[0]), parseInt(indvScore[1]), indvScore[2]);
            String[] stationTotal = scorecard.getStationTotal().split("-");
            scoreCardBeanList.add(cardBean);
        }
        return scoreCardBeanList;
    }
}
