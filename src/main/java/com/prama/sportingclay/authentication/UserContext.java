package com.prama.sportingclay.authentication;

import com.prama.sportingclay.view.bean.UserInfoBean;
import com.prama.sportingclay.view.bean.QuestionBean;
import com.prama.sportingclay.view.bean.ShooterInfoBean;

/**
 * Created by pmallapur on 6/27/2016.
 */
public class UserContext {

    protected UserInfoBean userInfoBean;
    protected QuestionBean questionBean;
    protected ShooterInfoBean shooterInfoBean;

    public UserInfoBean getUserInfoBean() {
        return userInfoBean;
    }

    public void setUserInfoBean(UserInfoBean userInfoBean) {
        this.userInfoBean = userInfoBean;
    }

    public QuestionBean getQuestionBean() {
        return questionBean;
    }

    public void setQuestionBean(QuestionBean questionBean) {
        this.questionBean = questionBean;
    }

    public ShooterInfoBean getShooterInfoBean() {
        return shooterInfoBean;
    }

    public void setShooterInfoBean(ShooterInfoBean shooterInfoBean) {
        this.shooterInfoBean = shooterInfoBean;
    }
}
