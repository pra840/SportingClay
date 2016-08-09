package com.prama.sportingclay.service.impl;

import com.prama.sportingclay.dao.AuthDAO;
import com.prama.sportingclay.dao.BaseDAO;
import com.prama.sportingclay.dao.FacilityDAO;
import com.prama.sportingclay.dao.ShooterDAO;
import com.prama.sportingclay.domain.*;
import com.prama.sportingclay.mapper.DomainToBeanMapper;
import com.prama.sportingclay.service.ShooterService;
import com.prama.sportingclay.view.bean.ScoreCardInputBean;
import com.prama.sportingclay.view.bean.ScoresInfoBean;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import static com.prama.sportingclay.domain.RoleEnum.*;
import static com.prama.sportingclay.mapper.DomainToBeanMapper.mapDomainToShootersBean;
import static com.prama.sportingclay.utility.ScoreManagementUtility.*;

/**
 * Created by pmallapur on 7/3/2016.
 */
@Service
public class ShooterServiceImpl implements ShooterService {

    @Autowired
    FacilityDAO facilityDAO;

    @Autowired
    ShooterDAO shooterDAO;

    @Autowired
    AuthDAO authDAO;

    @Autowired
    BaseDAO baseDAO;

    @Autowired
    DomainToBeanMapper mapper;

    @Override
    @Transactional
    public void signup(String shooterName, Long phoneNum, String occupation, String dob,
                       String shooterClass, String password, String emailAddress,
                       String question, String answer) {

        Shooter shooter = new Shooter();
        shooter.setShooterName(shooterName);
        shooter.setShooterClassId(ShooterClassEnum.getShooterClass(shooterClass));
        shooter.setShooterEmailAddress(emailAddress);
        shooter.setPhoneNumber(phoneNum);
        baseDAO.save(shooter);

        Question qstion = new Question();
        qstion.setQuestion(question);
        qstion.setAnswer(answer);
        baseDAO.save(qstion);

        SignUpInfo signUpInfo = new SignUpInfo();
        signUpInfo.setRegistrationdate(new Timestamp(System.currentTimeMillis()));
        signUpInfo.setQuestionId(qstion.getQuestionId());
        signUpInfo.setShooterId(shooter.getShooterId());
        baseDAO.save(signUpInfo);

        Auth auth = new Auth();
        auth.setShooterEmail(emailAddress);
        auth.setShooterPass(password);
        auth.setShooterId(shooter.getShooterId());
        auth.setRoleId(getRole(emailAddress));
        baseDAO.save(auth);
    }

    @Override
    public ShooterInfoBean getShooterInfoById(Integer shooterId) {
        Shooter shooter = shooterDAO.getShooterInfoById(shooterId);
        Auth auth = authDAO.getAuthenticationInfo(shooterId);
        return DomainToBeanMapper.mapDomainToBean(shooter, auth);
    }

    @Override
    public ShooterInfoBean getShooterDetails(String shooterName) {
        Shooter shooter = shooterDAO.getShooterInformation(shooterName);
        Auth auth = shooter!=null?authDAO.getAuthenticationInfo(shooter.getShooterId()): null;
        return DomainToBeanMapper.mapDomainToBean(shooter, auth);
    }

    @Override
    public ScoresInfoBean getScores(Integer userId, Integer facilityId, String startDate, String endDate) {
        List<ShooterScores> scores = shooterDAO.getShooterScores(userId, startDate, endDate);
        if(scores==null || scores.isEmpty())return null;
        List<Integer> scoreCardIds = scores.stream().map(ShooterScores::getScorecardId).collect(Collectors.toList());
        List<Scorecard> scorecards = shooterDAO.getScores(scoreCardIds);
        return mapper.mapDomainToBean(scores, scorecards);
    }

    @Override
    @Transactional
    public void submitScore(Integer userId, Integer facilityId, ScoreCardInputBean scoreCardInputBean) {
        if(facilityDAO.getFacility(facilityId)==null)
            return;
        if(shooterDAO.getShooterInfoById(userId)==null)
            return;

        Scorecard scorecard = new Scorecard();
        scorecard.setOutOfScore(scoreCardInputBean.getOutOfScore());
        scorecard.setStationTotal(getStationTotal(scoreCardInputBean));
        scorecard.setStation_Target_Score(getStationTargetScore(scoreCardInputBean));
        scorecard.setTotalScore(getTotalScore(scoreCardInputBean));
        baseDAO.save(scorecard);

        ShooterScores shooterScores = new ShooterScores();
        shooterScores.setScorecardId(scorecard.getScorecardId());
        shooterScores.setFacilityId(facilityId);
        shooterScores.setShooterId(userId);
        shooterScores.setGameDate(new Timestamp(System.currentTimeMillis()));
        baseDAO.save(shooterScores);
    }

    @Override
    public List<ShooterInfoBean> getShooters() {
        return mapDomainToShootersBean(shooterDAO.getShooters());
    }

    public Integer getRole (String emailAddress){
        if(StringUtils.containsIgnoreCase(emailAddress, "@sedonatek.com")
                || emailAddress.equalsIgnoreCase("pra840@gmail.com"))
            return SUPER_USER.getRoleId();
        if(CollectionUtils.isEmpty(facilityDAO.getFacilityByEmail(emailAddress))==false){
            return ADMIN.getRoleId();
        }
        return USER.getRoleId();
    }

}
