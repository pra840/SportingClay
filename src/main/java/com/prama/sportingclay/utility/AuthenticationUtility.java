package com.prama.sportingclay.utility;

import org.apache.commons.httpclient.Credentials;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.UsernamePasswordCredentials;
import org.apache.commons.httpclient.auth.AuthScope;
import org.apache.commons.httpclient.cookie.CookiePolicy;
import org.jboss.resteasy.client.ClientExecutor;
import org.jboss.resteasy.client.ClientRequest;
import org.jboss.resteasy.client.ClientRequestFactory;
import org.jboss.resteasy.client.core.executors.ApacheHttpClientExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;

@Component(value = "AuthenticationUtility")
public class AuthenticationUtility {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	public ClientRequest authenticateRequest(String url, String baseUrl,String userId, String password) {

		// String encodedUserID = new sun.misc.BASE64Encoder().encode (userId.getBytes());
		// String encodedPassword = new sun.misc.BASE64Encoder().encode (password.getBytes());

		if(url == null) throw new NullPointerException("url is null");
		logger.debug("URL = "+url+" BaseURL = "+baseUrl);
		Credentials credentials = new UsernamePasswordCredentials(userId, password);

		HttpClient httpClient = new HttpClient();
		httpClient.getState().setCredentials(AuthScope.ANY, credentials);
		httpClient.getParams().setAuthenticationPreemptive(true);

		httpClient.getParams().setParameter("http.protocol.cookie-policy", CookiePolicy.DEFAULT);

		ClientExecutor clientExecutor = new ApacheHttpClientExecutor(httpClient);

		ClientRequest request = null;

		if (baseUrl == null)
			baseUrl = url ;

		java.net.URI uri;
		try {

			logger.debug("baseUrl: " + baseUrl);
			uri = new java.net.URI(baseUrl);
		} catch (URISyntaxException e) {

			throw new RuntimeException(e);
		}
		ClientRequestFactory fac = new ClientRequestFactory(clientExecutor, uri);
		request = fac.createRequest(url);
		return request;
	}

	public ClientRequest authenticateRequest(String url, String userId, String password) {
		return authenticateRequest(url, null, userId, password);
	}
}
