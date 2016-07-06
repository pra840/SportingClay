package com.prama.sportingclay.utility;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;

import javax.ws.rs.QueryParam;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.apache.commons.lang.StringUtils.isEmpty;

@Component
public class LoginValidator {

    private static final String VALIDATE_NAME = "^[a-zA-Z0-9-' ]{1,40}$";
    //private static final String VALID_PASS = "^(?=.*[0-9])(?=.*[a-z])$";

    /*Explanation:
            ^                 # start-of-string
            (?=.*[0-9])       # a digit must occur at least once
            (?=.*[a-z])       # a lower case letter must occur at least once
            (?=.*[A-Z])       # an upper case letter must occur at least once
            (?=.*[@#$%^&+=])  # a special character must occur at least once
            (?=\S+$)          # no whitespace allowed in the entire string
            .{8,}             # anything, at least eight places though
    $                 # end-of-string
    */

    public static void validate(String incomingPass, String password){
        if(incomingPass.equals(password)==false)
            throw new RuntimeException("WRONG PASSWORD!!");
    }

    public static void validateIncomingPass(String pass) {
//        Pattern pattern = Pattern.compile(VALID_PASS);
//        Matcher password = pattern.matcher(pass);

        if(isEmpty(pass)){
            throw new RuntimeException("WRONG PASSWORD FORMAT");
        }
    }
}
