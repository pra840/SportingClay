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

    protected void redirectToPage(String page, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher(page).forward(request, response);
    }
}
