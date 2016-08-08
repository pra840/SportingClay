package com.prama.sportingclay.rest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by pmallapur on 6/21/2016.
 */
public abstract class BaseController {
    public static final String LOGIN_PAGE = "/public/login.html";
    public static final String SUPERUSER_PAGE = "/public/superuser.html";
    public static final String FACILITIES_PAGE = "/public/facility_home.html";
    public static final String ERROR_PAGE = "/public/error.html";
    public static final String NEW_FACILITY_PAGE = "/public/signupFacilities.html";
    public static final String USER_PAGE = "/public/user.html";
    public static final String USERS_PAGE = "/public/users.html";

    protected void redirectToPage(String page, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher(page).forward(request, response);
    }

    protected void resendToPage(String page, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect(page);
    }
}
