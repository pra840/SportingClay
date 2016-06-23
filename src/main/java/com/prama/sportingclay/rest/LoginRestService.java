package com.prama.sportingclay.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.prama.sportingclay.literals.ApplicationLiterals.applicationRoot;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by pmallapur on 6/21/2016.
 */
@RestController
@RequestMapping(value = {applicationRoot})
public class LoginRestService extends BaseController {

    //http://192.168.185.159:8072/prama/shooter/Prasad Mallapur

    @RequestMapping(value = { "/login" }, method = GET)
    public void loadLogin(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        redirectToPage(LOGIN_PAGE, request, response);
    }
}
