package com.prama.sportingclay.utility;

import com.prama.sportingclay.exception.PramaException;
import com.prama.sportingclay.literals.ExceptionLiterals;
import org.apache.commons.lang.StringUtils;

/**
 * Created by pmallapur on 6/20/2016.
 */

public class Validator {

    public static void inputValidator(String textToValidate) throws PramaException {
        if(StringUtils.isEmpty(textToValidate))
            throw new PramaException(ExceptionLiterals.INVALID_INPUT_EXCEPTION_ID, ExceptionLiterals.INVALID_INPUT_EXCEPTION);
    }
}
