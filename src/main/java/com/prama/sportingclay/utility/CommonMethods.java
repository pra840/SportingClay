package com.prama.sportingclay.utility;

import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by pmallapur on 6/28/2016.
 */

@Component
public class CommonMethods {

    public static boolean isEmail(String inputParameter){
        Pattern p = Pattern.compile(".+@.+\\.[a-z]+");
        Matcher m = p.matcher(inputParameter);
        return m.matches();
    }

    public static String removeLastCharacter(String str) {
        if(str.charAt(str.length()-1)=='/')
            return str.substring(0, str.length()-1);
        return str;
    }
}
