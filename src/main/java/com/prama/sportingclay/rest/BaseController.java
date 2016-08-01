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
    public static final String FACILITIES_PAGE = "/public/superuser.html";
    public static final String ERROR_PAGE = "/public/error.html";

    protected void redirectToPage(String page, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher(page).forward(request, response);
    }

    protected void resendToPage(String page, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect(page);
    }
}
