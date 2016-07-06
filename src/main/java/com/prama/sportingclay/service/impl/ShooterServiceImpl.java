package com.prama.sportingclay.service.impl;

import com.prama.sportingclay.dao.AuthDAO;
import com.prama.sportingclay.dao.BaseDAO;
import com.prama.sportingclay.dao.ShooterDAO;
import com.prama.sportingclay.domain.*;
import com.prama.sportingclay.mapper.DomainToBeanMapper;
import com.prama.sportingclay.service.ShooterService;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

/**
 * Created by pmallapur on 7/3/2016.
 */
@Service
public class ShooterServiceImpl implements ShooterService {

    @Autowired
    AuthDAO authDAO;

    @Autowired
    ShooterDAO shooterDAO;

    @Autowired
    BaseDAO baseDAO;

    @Autowired
    DomainToBeanMapper mapper;

    @Override
    @Transactional
    public void signup(String shooterName, Integer phoneNum, String occupation, String dob,
                       String shooterClass, String password, String emailAddress,
                       String question, String answer) {

        Shooter shooter = new Shooter();
        shooter.setShooterName(shooterName);
        shooter.setShooterClassId(ShooterClassEnum.getShooterClass(shooterClass));
        shooter.setShooterEmailAddress(emailAddress);
        shooter.setPhoneNumber(new Long(phoneNum));

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
        baseDAO.save(auth);
    }

    @Override
    public ShooterInfoBean getShooterInfoById(Integer shooterId) {
        return mapper.mapDomainToBean(shooterDAO.getShooterInfoById(shooterId));
    }

    @Override
    public ShooterInfoBean getShooterDetails(String shooterName) {
        Shooter shooter = shooterDAO.getShooterInformation(shooterName);
        return mapper.mapDomainToBean(shooter);
    }
}
