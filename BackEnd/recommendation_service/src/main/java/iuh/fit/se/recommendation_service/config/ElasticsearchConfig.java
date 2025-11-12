package iuh.fit.se.recommendation_service.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
@Slf4j
public class ElasticsearchConfig {
    @Value("${spring.elasticsearch.uris}")
    private String elasticsearchUri;

    @Value("${spring.elasticsearch.username}")
    private String username;

    @Value("${spring.elasticsearch.password}")
    private String password;

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        try {
            log.info("🔐 Connecting to Elasticsearch at {}", elasticsearchUri);

            final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
            credentialsProvider.setCredentials(AuthScope.ANY,
                    new UsernamePasswordCredentials(username, password));

            RestClient restClient = RestClient.builder(HttpHost.create(elasticsearchUri))
                    .setHttpClientConfigCallback((HttpAsyncClientBuilder builder) ->
                            builder.setDefaultCredentialsProvider(credentialsProvider))
                    .build();

            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());

            ElasticsearchTransport transport = new RestClientTransport(
                    restClient, new JacksonJsonpMapper(mapper));

            log.info("✅ Connected to Elasticsearch (HTTP, secured by password)");
            return new ElasticsearchClient(transport);
        } catch (Exception e) {
            log.error("❌ Elasticsearch connection failed: {}", e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }
}
