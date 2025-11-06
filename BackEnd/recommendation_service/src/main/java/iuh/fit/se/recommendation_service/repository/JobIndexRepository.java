package iuh.fit.se.recommendation_service.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.JsonData;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.*;

@Repository
@RequiredArgsConstructor
public class JobIndexRepository {

    private static final Logger log = LoggerFactory.getLogger(JobIndexRepository.class);
    private final ElasticsearchClient esClient;
    private static final String INDEX = "jobs";

    public IndexResponse indexJob(String id, Map<String, Object> doc) throws IOException {
        log.info("[JobIndexRepository] Indexing job id={} with fields={}", id, doc.keySet());
        try {
            IndexResponse resp = esClient.index(i -> i.index(INDEX).id(id).document(doc));
            log.info("[JobIndexRepository] Indexed job id={} result={}", id, resp.result().jsonValue());
            return resp;
        } catch (Exception e) {
            log.error("[JobIndexRepository] Error indexing job id=" + id, e);
            throw e;
        }
    }

    public List<Map<String, Object>> semanticSearch(List<Double> queryVec, int k) throws IOException {
        log.info("[JobIndexRepository] Searching top={} jobs with vector size={}", k, queryVec.size());
        try {
            SearchResponse<Map> resp = esClient.search(s -> s
                            .index(INDEX)
                            .size(k)
                            .query(q -> q
                                    .scriptScore(sc -> sc
                                            .query(q2 -> q2.matchAll(m -> m))
                                            .script(scp -> scp
                                                    .source("cosineSimilarity(params.query_vector, 'embedding') + 1.0")
                                                    .params(Map.of("query_vector", JsonData.of(queryVec))) // ✅ FIXED
                                            )
                                    )
                            ),
                    Map.class
            );

            List<Map<String, Object>> results = new ArrayList<>();
            for (Hit<Map> hit : resp.hits().hits()) {
                Map<String, Object> src = hit.source();
                src.put("_score", hit.score());
                results.add(src);
            }

            log.info("[JobIndexRepository] Found {} matching jobs", results.size());
            return results;
        } catch (Exception e) {
            log.error("[JobIndexRepository] Elasticsearch search error", e);
            throw e;
        }
    }
}
