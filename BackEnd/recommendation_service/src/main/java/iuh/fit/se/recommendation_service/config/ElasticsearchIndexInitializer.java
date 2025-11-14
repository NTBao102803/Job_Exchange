package iuh.fit.se.recommendation_service.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@Slf4j
public class ElasticsearchIndexInitializer implements ApplicationRunner {

    private final ElasticsearchClient esClient;

    @Override
    public void run(ApplicationArguments args) {
        waitForElasticsearch();
        createIndexIfNotExists("jobs", "elasticsearch/job-index.json");
        createIndexIfNotExists("candidates", "elasticsearch/candidate-index.json");
    }

    private void waitForElasticsearch() {
        int maxRetries = 60;
        int delaySeconds = 3;
        for (int i = 0; i < maxRetries; i++) {
            try {
                if (esClient.ping().value()) {
                    log.info("Elasticsearch đã sẵn sàng!");
                    return;
                }
            } catch (Exception e) {
                log.warn("Chưa kết nối được Elasticsearch (lần {}/{}): {}", i + 1, maxRetries, e.getMessage());
            }
            try {
                Thread.sleep(delaySeconds * 1000L);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
        }
        throw new RuntimeException("Không thể kết nối tới Elasticsearch sau " + maxRetries + " lần thử");
    }

    private void createIndexIfNotExists(String indexName, String mappingFile) {
        try {
            boolean exists = esClient.indices().exists(e -> e.index(indexName)).value();
            if (exists) {
                log.info("Index '{}' đã tồn tại.", indexName);
                return;
            }

            String json;
            try (InputStream is = new ClassPathResource(mappingFile).getInputStream()) {
                json = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            }

            esClient.indices().create(c -> c
                    .index(indexName)
                    .withJson(new StringReader(json))
            );
            log.info("Tạo thành công index: {}", indexName);
        } catch (Exception e) {
            log.error("Lỗi tạo index '{}': {}", indexName, e.getMessage());
            throw new RuntimeException("Không thể khởi tạo index: " + indexName, e);
        }
    }
}