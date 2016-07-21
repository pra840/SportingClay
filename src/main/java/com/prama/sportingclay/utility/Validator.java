package com.prama.sportingclay.utility;

import com.prama.sportingclay.exception.PramaException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.prama.sportingclay.literals.ExceptionLiterals.INVALID_INPUT_EXCEPTION;
import static com.prama.sportingclay.literals.ExceptionLiterals.INVALID_INPUT_EXCEPTION_ID;
import static com.prama.sportingclay.utility.CommonMethods.isEmail;
import static org.apache.commons.lang.StringUtils.isEmpty;

/**
 * Created by pmallapur on 6/20/2016.
 */

public class Validator {

    private static final String phoneNumPattern = "\\d{10}$";

    public static void inputValidator(String textToValidate) throws PramaException {
        if(isEmpty(textToValidate))
            throw new PramaException(INVALID_INPUT_EXCEPTION_ID, INVALID_INPUT_EXCEPTION);
    }

    public static void validateSignUpParams(String shooterName,String phoneNumber,String occupation,
                                            String dob,String shooterClass,String password,
                                            String emailAddress,String question,String answer){
        try {
            if(isEmpty(shooterName) && isEmpty(emailAddress))
                throw new PramaException(INVALID_INPUT_EXCEPTION_ID, INVALID_INPUT_EXCEPTION);
            isValidEmail(emailAddress);
            if(isEmpty(phoneNumber)==false)
                isValidPhoneNumber(Integer.parseInt(phoneNumber));
            if (isEmpty(password) || isEmpty(question)|| isEmpty(answer)){
                throw new PramaException(INVALID_INPUT_EXCEPTION_ID, INVALID_INPUT_EXCEPTION);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    private static void isValidPhoneNumber(Integer phoneNum){
        if(phoneNum==null && phoneNum==0) return;
        Pattern pattern = Pattern.compile(phoneNumPattern);
        Matcher matcher = pattern.matcher(phoneNum.toString());

        if (matcher.matches()==false) {
            throw new PramaException(INVALID_INPUT_EXCEPTION_ID, INVALID_INPUT_EXCEPTION);
        }
    }

    private static void isValidEmail(String email){
        if(isEmail(email)==false)
            throw new PramaException(INVALID_INPUT_EXCEPTION_ID, INVALID_INPUT_EXCEPTION);
    }
}
