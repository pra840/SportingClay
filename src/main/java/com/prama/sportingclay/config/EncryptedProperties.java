package com.prama.sportingclay.config;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.spring31.properties.EncryptablePropertiesPropertySource;
import org.springframework.boot.env.PropertySourceLoader;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

import java.io.IOException;
import java.util.Properties;

public class EncryptedProperties implements PropertySourceLoader {

    private final StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();

    public String encryptionKey = System.getProperty("encryptionKey");

    public EncryptedProperties() {
        this.encryptor.setPassword(encryptionKey);
    }

    @Override
    public String[] getFileExtensions() {
        return new String[]{"properties"};
    }

    @Override
    public PropertySource<?> load(final String name, final Resource resource, final String profile) throws IOException {
        if (profile == null) {
            final Properties props = PropertiesLoaderUtils.loadProperties(resource);

            if (!props.isEmpty()) {
                return new EncryptablePropertiesPropertySource(name, props, this.encryptor);
            }
        }
        return null;
    }

}
