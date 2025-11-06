package iuh.fit.se.recommendation_service.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiEmbeddingService {

    private static final Logger log = LoggerFactory.getLogger(GeminiEmbeddingService.class);
    private final WebClient geminiWebClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String model = "text-embedding-004";

    public List<Double> getEmbedding(String text) {
        try {
            log.info("[GeminiEmbeddingService] Requesting embedding for text (length={}): {}", text.length(), text);

            Map<String, Object> requestBody = Map.of(
                    "content", Map.of(
                            "parts", List.of(Map.of("text", text))
                    )
            );

            String uri = "/models/" + model + ":embedContent?key=" + apiKey;

            Map<String, Object> response = geminiWebClient.post()
                    .uri(uri)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .doOnError(e -> log.error("[GeminiEmbeddingService] Error calling Gemini API", e))
                    .onErrorResume(e -> Mono.empty())
                    .block();

            if (response == null || !response.containsKey("embedding")) {
                throw new RuntimeException("No embedding returned from Gemini for text: " + text);
            }

            Map<String, Object> embedding = (Map<String, Object>) response.get("embedding");
            List<Double> values = (List<Double>) embedding.get("values");

            log.info("[GeminiEmbeddingService] Got embedding size: {}", values.size());
            return values;

        } catch (Exception e) {
            log.error("[GeminiEmbeddingService] Exception while getting embedding", e);
            throw e;
        }
    }
}
