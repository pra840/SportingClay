package com.prama.sportingclay.utility;

import com.prama.sportingclay.authentication.UserContext;
import org.springframework.stereotype.Component;

/**
 * Created by pmallapur on 8/3/2016.
 */
@Component
public class UserContextProvider {

    public UserContext getUserContext() {
        return userContext;
    }

    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    protected UserContext userContext;
}
