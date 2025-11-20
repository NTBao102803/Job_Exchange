package iuh.fit.se.payment_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.payment_service.dto.SepayTransactionDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SepayTransactionService {

    @Value("${sepay.api-token}")
    private String apiToken; // Bearer token


    @Value("${sepay.transactions-url}")
    private String transactionsUrl; // https://my.sepay.vn/userapi/transactions/list

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<SepayTransactionDTO> getTransactions() throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiToken); // Thêm Bearer Token

        HttpEntity<String> request = new HttpEntity<>(null, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                transactionsUrl,
                HttpMethod.GET,
                request,
                String.class
        );
        log.info("SePay API response: {}", response.getBody());
        log.info("Using Sepay token: {}", apiToken);
        JsonNode root = mapper.readTree(response.getBody());
        List<SepayTransactionDTO> transactions = new ArrayList<>();

        if (root.has("transactions")) {
            for (JsonNode node : root.get("transactions")) {
                SepayTransactionDTO tx = new SepayTransactionDTO();
                tx.setId(node.path("id").asText());
                tx.setBankBrandName(node.path("bank_brand_name").asText());
                tx.setAccountNumber(node.path("account_number").asText());

                String dateStr = node.path("transaction_date").asText();
                tx.setTransactionDate(LocalDateTime.parse(dateStr.replace(" ", "T")));

                tx.setAmountIn(node.path("amount_in").asDouble());
                tx.setAmountOut(node.path("amount_out").asDouble());
                tx.setAccumulated(node.path("accumulated").asDouble());

                tx.setTransactionContent(node.path("transaction_content").asText());
                tx.setReferenceNumber(node.path("reference_number").asText());
                tx.setCode(node.path("code").isNull() ? null : node.path("code").asText());
                tx.setSubAccount(node.path("sub_account").isNull() ? null : node.path("sub_account").asText());
                tx.setBankAccountId(node.path("bank_account_id").asText());

                transactions.add(tx);
            }
        }
        log.info("Total transactions parsed: {}", transactions.size());

        return transactions;
    }
}
