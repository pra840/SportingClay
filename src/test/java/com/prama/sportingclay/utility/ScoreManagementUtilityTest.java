package com.prama.sportingclay.utility;

import com.prama.sportingclay.view.bean.ScoreCardInputBean;
import org.junit.Before;
import org.junit.Test;

import static com.prama.sportingclay.utility.ScoreManagementUtility.*;
import static org.junit.Assert.assertEquals;

/**
 * Created by pmallapur on 7/15/2016.
 */
public class ScoreManagementUtilityTest {

    ScoreCardInputBean scoreCardInputBean;

    @Before
    public void setup(){
        scoreCardInputBean = new ScoreCardInputBean();
        scoreCardInputBean.setOutOfScore(10);
        scoreCardInputBean.setTotal(8);
        scoreCardInputBean.setStation1("1-1,2-0,3-1,4-1,5-0");
        scoreCardInputBean.setStation2("1-1,2-0,3-1,4-1,5-1");
        scoreCardInputBean.setStation3("1-0,2-0,3-1,4-0,5-0");
        scoreCardInputBean.setStation4("1-1,2-0,3-0,4-1,5-0");
        scoreCardInputBean.setStation5("1-0,2-0,3-1,4-1,5-1");
    }

    @Test
    public void testStationTargetScore(){
        assertEquals("1-1-1,1-2-0,1-3-1,1-4-1,1-5-0,2-1-1,2-2-0,2-3-1,2-4-1,2-5-1,3-1-0,3-2-0,3-3-1,3-4-0,3-5-0,4-1-1,4-2-0,4-3-0,4-4-1,4-5-0,5-1-0,5-2-0,5-3-1,5-4-1,5-5-1",
                getStationTargetScore(scoreCardInputBean));
    }

    @Test
    public void testTotalByTarget(){
        assertEquals("2-4", getTotalByTarget(2, "1-1,2-0,3-1,4-1,5-1"));
    }

    @Test
    public void testStationTotal(){
        assertEquals("1-3,2-4,3-1,4-2,5-3", getStationTotal(scoreCardInputBean));
    }

    @Test
    public void testScoreByStation(){
        assertEquals("1-1-1,1-2-0,1-3-1,1-4-1,1-5-0", getScoreByStation(1, "1-1,2-0,3-1,4-1,5-0"));
    }

    @Test
    public void testTotalScore(){
        assertEquals(new Integer(13),getTotalScore(scoreCardInputBean));
    }
}
