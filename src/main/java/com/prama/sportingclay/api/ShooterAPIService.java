package com.prama.sportingclay.api;

import com.prama.sportingclay.application.AppConfig;
import com.prama.sportingclay.dao.ShooterDAO;
import com.prama.sportingclay.utility.AuthenticationUtility;
import com.prama.sportingclay.view.bean.ShooterInfoBean;
import org.jboss.resteasy.client.ClientRequest;
import org.jboss.resteasy.client.ClientResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by pmallapur on 6/28/2016.
 */
@Service
public class ShooterAPIService{

    @Autowired
    private ShooterDAO shooterDAO;

    @Resource
    private AuthenticationUtility authenticationUtility;

    @Autowired
    private AppConfig config;

    public ShooterInfoBean getShooterInfoAPI(String userName) {

        try {
            ClientRequest request = getClientRequest(config.getShooterInfoURL());

            request.pathParameter("shooterName", "" + userName+"/");

            ClientResponse<ShooterInfoBean> response = request.get(ShooterInfoBean.class);

            if (response.getEntity() == null) {
                throw new RuntimeException("SERVICE CALL FAILED..");
            }
            return response.getEntity();
        } catch (Throwable th) {
            th.printStackTrace();
        }
        return null;
    }

    protected ClientRequest getClientRequest(String service) {

        ClientRequest request = authenticationUtility.authenticateRequest(
                config.getBaseURL() + service,
                config.getBaseURL(),
                config.getServiceUserId(),
                config.getServicePassword());
        return request;
    }
}
