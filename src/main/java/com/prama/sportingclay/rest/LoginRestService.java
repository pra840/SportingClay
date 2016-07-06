package com.prama.sportingclay.rest;

import com.prama.sportingclay.api.ShooterAPIService;
import com.prama.sportingclay.dao.AuthDAO;
import com.prama.sportingclay.domain.Auth;
import com.prama.sportingclay.exception.PramaException;
import com.prama.sportingclay.mapper.DomainToBeanMapper;
import com.prama.sportingclay.service.ShooterService;
import com.prama.sportingclay.utility.LoginValidator;
import com.prama.sportingclay.utility.Validator;
import com.prama.sportingclay.view.bean.LoginDataBean;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.QueryParam;
import java.io.IOException;

import static com.prama.sportingclay.literals.ApplicationLiterals.applicationRoot;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by pmallapur on 6/21/2016.
 */
@RestController
@RequestMapping(value = {applicationRoot})
public class LoginRestService extends BaseController {

    //http://10.10.33.138:8072/prama/shooter/Prasad Mallapur
    @Autowired
    AuthDAO authDAO;

    @Autowired
    DomainToBeanMapper mapper;

    @Autowired
    LoginValidator validator;

    @Autowired
    ShooterAPIService shooterAPIService;

    @Autowired
    ShooterService shooterService;

    @RequestMapping(value = { "/login" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public void loadLogin(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        redirectToPage(LOGIN_PAGE, request, response);
    }

    @RequestMapping(value = { "/shooter/auth" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public ShooterInfoBean validateCreds(@QueryParam("userId") String userId,
                                         @QueryParam("pass") String pass) throws ServletException, IOException, RuntimeException {
        validator.validateIncomingPass(pass);
        Auth auth = authDAO.getAuthenticationInfo(userId);
        LoginDataBean loginDataBean = new LoginDataBean();
        ShooterInfoBean shooterInfoBean = null;
        if(auth!=null && auth.getShooterPass()!=null) {
            validator.validate(pass, auth.getShooterPass());
            loginDataBean.setSuccess("Y");
            shooterInfoBean = shooterService.getShooterInfoById(auth.getShooterId());
            if(auth.getShooterId()==1) {
                loginDataBean.setRole("Admin");
            }else{
                loginDataBean.setRole("User");
            }
            shooterInfoBean.setLoginDataBean(loginDataBean);
        }
        return shooterInfoBean;
    }

    @RequestMapping(value = { "/shooter/signup" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public LoginDataBean signUp(@QueryParam("shooterName") String shooterName,
                       @QueryParam("phoneNum") Integer phoneNum,
                       @QueryParam("occupation") String occupation,
                       @QueryParam("dob") String dob,
                       @QueryParam("shooterClass") String shooterClass,
                       @QueryParam("password") String password,
                       @QueryParam("emailAddress") String emailAddress,
                       @QueryParam("question")String question,
                       @QueryParam("answer")String answer) throws ServletException, IOException {

        Validator.validateSignUpParams(shooterName,phoneNum, occupation,
                 dob, shooterClass, password,emailAddress,question,answer);
        Auth auth = authDAO.getAuthenticationInfo(emailAddress);
        if(auth!=null){
            throw new PramaException(4, "DUPLICATE email.");
        }
        LoginDataBean loginDataBean = new LoginDataBean();

        shooterService.signup(shooterName,phoneNum,occupation,dob,shooterClass,password,emailAddress,
                question,answer);
        loginDataBean.setSuccess("Y");
        return loginDataBean;
    }
}
