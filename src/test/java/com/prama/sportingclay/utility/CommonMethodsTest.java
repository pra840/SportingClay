package com.prama.sportingclay.utility;

import org.junit.Test;

import static com.prama.sportingclay.utility.CommonMethods.isEmail;
import static com.prama.sportingclay.utility.CommonMethods.removeLastCharacter;
import static org.junit.Assert.*;

/**
 * Created by pmallapur on 6/28/2016.
 */

public class CommonMethodsTest {

    @Test
    public void testEmail_wrong(){
        assertFalse(isEmail(""));
    }

    @Test
    public void testEmail_fake(){
        assertFalse(isEmail("a@b"));
    }

    @Test
    public void testEmail_right(){
        assertTrue(isEmail("a@b.com"));
    }

    @Test
    public void testStringLastCharRemovalIfEndsWithSpecialChar(){
        assertEquals("Prasad", removeLastCharacter("Prasad/"));
    }

    @Test
    public void testStringLastCharRemovalIfNOTEndsWithSpecialChar(){
        assertEquals("Prasad", removeLastCharacter("Prasad"));
    }
}
