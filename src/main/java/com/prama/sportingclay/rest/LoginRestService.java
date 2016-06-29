package com.prama.sportingclay.rest;

import com.prama.sportingclay.api.ShooterAPIService;
import com.prama.sportingclay.dao.AuthDAO;
import com.prama.sportingclay.domain.Auth;
import com.prama.sportingclay.mapper.DomainToBeanMapper;
import com.prama.sportingclay.utility.LoginValidator;
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
import static org.springframework.web.bind.annotation.RequestMethod.POST;

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

    @RequestMapping(value = { "/login" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public void loadLogin(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        redirectToPage(LOGIN_PAGE, request, response);
    }

    @RequestMapping(value = { "/shooter/auth" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public ShooterInfoBean validateCreds(@QueryParam("userId") String userId,
                                         @QueryParam("pass") String pass) throws ServletException, IOException, RuntimeException {
        validator.validateIncomingPass(pass);
        Auth auth = authDAO.getAuthenticationInfo(userId);

        if(auth==null)return null;

        if(auth.getShooterPass()!=null) validator.validate(pass, auth.getShooterPass());

        if(auth.getShooterEmail()!=null)
            return shooterAPIService.getShooterInfoAPI(auth.getShooterEmail());
        return null;
    }

    @RequestMapping(value = { "/signup" }, method = POST, produces = APPLICATION_JSON_VALUE)
    public void signUp(@QueryParam("shooterName") String shooterName,
                       @QueryParam("phoneNum") Integer phoneNumber,
                       @QueryParam("occupation") String occupation,
                       @QueryParam("dob") String dob,
                       @QueryParam("shooterClass") String shooterClass,
                       @QueryParam("password") String password,
                       @QueryParam("email") String email,
                       @QueryParam("question")String question,
                       @QueryParam("answer")String answer) throws ServletException, IOException {


    }
}
