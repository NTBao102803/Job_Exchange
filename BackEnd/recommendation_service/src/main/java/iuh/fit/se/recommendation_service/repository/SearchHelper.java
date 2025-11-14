package iuh.fit.se.recommendation_service.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.JsonData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class SearchHelper {

    private final ElasticsearchClient esClient;

    public List<Map<String, Object>> semanticSearch(String index, List<Double> queryVec, int k) throws IOException {
        SearchResponse<Map> resp = esClient.search(s -> s
                        .index(index)
                        .size(k)
                        .query(q -> q
                                .scriptScore(ss -> ss
                                        .query(qq -> qq.matchAll(ma -> ma))
                                        .script(sc -> sc
                                                .source("cosineSimilarity(params.query_vector, 'embedding') + 1.0")
                                                .params(Map.of("query_vector", JsonData.of(queryVec)))
                                        )
                                )
                        ),
                Map.class
        );

        List<Map<String, Object>> results = new ArrayList<>();
        for (var hit : resp.hits().hits()) {
            Map<String, Object> src = hit.source() != null ? hit.source() : new HashMap<>();
            src.put("_score", hit.score());
            results.add(src);
        }
        return results;
    }

    public void indexDocument(String index, String id, Map<String, Object> doc) throws IOException {
        esClient.index(i -> i.index(index).id(id).document(doc));
    }

}