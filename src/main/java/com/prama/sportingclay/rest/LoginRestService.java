package com.prama.sportingclay.rest;

import com.prama.sportingclay.authentication.UserContext;
import com.prama.sportingclay.dao.AuthDAO;
import com.prama.sportingclay.domain.Auth;
import com.prama.sportingclay.exception.PramaException;
import com.prama.sportingclay.service.ShooterService;
import com.prama.sportingclay.utility.LoginValidator;
import com.prama.sportingclay.utility.UserContextProvider;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import java.io.IOException;

import static com.prama.sportingclay.literals.ApplicationLiterals.applicationRoot;
import static com.prama.sportingclay.literals.ExceptionLiterals.DUPLICATE_EMAIL_EXCEPTION;
import static com.prama.sportingclay.literals.ExceptionLiterals.DUPLICATE_EMAIL_EXCEPTION_ID;
import static com.prama.sportingclay.utility.CommonMethods.replaceUnwantedChar;
import static com.prama.sportingclay.utility.Validator.validateSignUpParams;
import static java.lang.Long.parseLong;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.util.StringUtils.isEmpty;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by pmallapur on 6/21/2016.
 */
@RestController
@RequestMapping(value = {applicationRoot})
public class LoginRestService extends BaseController {

    @Autowired
    AuthDAO authDAO;

    @Autowired
    LoginValidator validator;

    @Autowired
    ShooterService shooterService;

    @Autowired
    UserContextProvider userContextProvider;

    @Value("${spring.profiles.active}")
    private String profile;

    @RequestMapping(value = { "/login" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public void loadLogin(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCookie(response);
        redirectToPage(LOGIN_PAGE, request, response);
    }

    @RequestMapping(value = { "/error" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public void loadErrorPage(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        redirectToPage(ERROR_PAGE, request, response);
    }

    private void setCookie(HttpServletResponse response){
        response.addCookie(new Cookie("env", profile));
    }

    @RequestMapping(value = { "/shooter/auth" }, method = POST, produces = APPLICATION_JSON_VALUE)
    public Response validateCreds(@QueryParam("userId") String userId,
                                  @QueryParam("pass") String pass) throws ServletException, IOException {

        validator.validateIncomingPass(pass);
        Auth auth = authDAO.getAuthenticationInfo(userId);

        ShooterInfoBean shooterInfoBean = null;

        if(auth!=null && auth.getShooterPass()!=null) {
            validator.validate(pass, auth.getShooterPass());
            shooterInfoBean = shooterService.getShooterInfoById(auth.getShooterId());
        }

        if(shooterInfoBean==null || shooterInfoBean.getLoginDataBean()==null)
            return Response.ok().entity(shooterInfoBean).build();
        userContextProvider.setUserContext(new UserContext(shooterInfoBean));
        return Response.ok().entity(shooterInfoBean)
                .cookie(new NewCookie("prama-user", shooterInfoBean.getLoginDataBean().getId().toString()+"-"+shooterInfoBean.getLoginDataBean().getRole()))
                .build();
    }

    @RequestMapping(value = { "/shooter/signup" }, method = POST, produces = APPLICATION_JSON_VALUE)
    public void signUp(@QueryParam("shooterName") String shooterName,
                       @QueryParam("phoneNum") String phoneNum,
                       @QueryParam("occupation") String occupation,
                       @QueryParam("dob") String dob,
                       @QueryParam("shooterClass") String shooterClass,
                       @QueryParam("password") String password,
                       @QueryParam("emailAddress") String emailAddress,
                       @QueryParam("question")String question,
                       @QueryParam("answer")String answer) throws ServletException, IOException {

        Long phoneNumber = null;

        if(isEmpty(phoneNum)==false){
            phoneNumber = parseLong(replaceUnwantedChar(phoneNum, "\""));
        }

        validateSignUpParams(shooterName, phoneNum, occupation, dob, shooterClass, password,emailAddress,question,answer);

        Auth auth = authDAO.getAuthenticationInfo(emailAddress);
        if(auth!=null){
            throw new PramaException(DUPLICATE_EMAIL_EXCEPTION_ID, DUPLICATE_EMAIL_EXCEPTION);
        }
        shooterService.signup(shooterName,phoneNumber,occupation,dob,shooterClass,password,emailAddress,
                question,answer);
    }

    @RequestMapping(value = { "/superuser/{superuser}" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public void superuserHandler(@PathVariable("superuser") String superuser, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        redirectToPage(SUPERUSER_PAGE, request, response);
    }

    @RequestMapping(value = { "/user/{user}" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public void userHandler(@PathVariable("user") String user, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.addCookie(new Cookie("prama-user", user));
        redirectToPage(USER_PAGE, request, response);
    }

    @RequestMapping(value = { "/usersView" }, method = GET, produces = APPLICATION_JSON_VALUE)
    public void getAllUsers(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        redirectToPage(USERS_PAGE, request, response);
    }
}
