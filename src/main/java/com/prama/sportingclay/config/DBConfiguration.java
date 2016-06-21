package com.prama.sportingclay.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

/**
 * Created by pmallapur on 6/19/2016.
 */
@Configuration
public class DBConfiguration {

    @Bean (name = "sportingclayDataSource")
    @Primary
    @ConfigurationProperties(prefix="datasource.sportingclay")
    public DataSource sportingClayDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    @Primary
    public JpaTransactionManager sportingClayTransactionManager(@Qualifier("sportingclayEmf") final EntityManagerFactory factory) {
        return new JpaTransactionManager(factory);
    }

    @Bean(name = "sportingclayEmf")
    public LocalContainerEntityManagerFactoryBean sportingclayEntityManagerFactory(
            EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(sportingClayDataSource())
                .packages("com.prama.sportingclay.domain")
                .persistenceUnit("sportingclay")
                .build();
    }
}
