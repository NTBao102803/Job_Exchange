package iuh.fit.se.payment_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.payment_service.dto.MomoResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MomoPaymentClient {

    @Value("${momo.partner-code}")
    private String partnerCode;

    @Value("${momo.access-key}")
    private String accessKey;

    @Value("${momo.secret-key}")
    private String secretKey;

    @Value("${momo.endpoint}")
    private String endpoint;

    @Value("${momo.redirect-url}")
    private String redirectUrl;

    @Value("${momo.ipn-url}")
    private String ipnUrl;

    private final ObjectMapper mapper = new ObjectMapper();

    public MomoResponseDTO createPayment(String orderId, double amount, String orderInfo) throws Exception {
        // Build payload similar to Momo docs.
        String requestId = String.valueOf(System.currentTimeMillis());

        Map<String, Object> payload = new HashMap<>();
        payload.put("partnerCode", partnerCode);
        payload.put("accessKey", accessKey);
        payload.put("requestId", requestId);
        payload.put("amount", String.valueOf((long) amount));
        payload.put("orderId", orderId);
        payload.put("orderInfo", orderInfo);
        payload.put("redirectUrl", redirectUrl);
        payload.put("ipnUrl", ipnUrl);
        payload.put("lang", "vi");
        payload.put("requestType", "captureWallet");

        // TODO: compute signature HMAC_SHA256 according to Momo docs and add to payload
        // For demo/sandbox we may skip signature construction if endpoint allows; but in prod must sign.
        String rawSignature = ""; // compute as docs
        payload.put("signature", rawSignature);

        String body = mapper.writeValueAsString(payload);
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> resp = HttpClient.newHttpClient().send(req, HttpResponse.BodyHandlers.ofString());
        Map<String, Object> map = mapper.readValue(resp.body(), Map.class);

        MomoResponseDTO dto = new MomoResponseDTO();
        dto.setOrderId((String) map.get("orderId"));
        dto.setRequestId((String) map.get("requestId"));
        dto.setPayUrl((String) map.get("payUrl"));
        dto.setQrCodeUrl((String) map.get("qrCodeUrl"));
        dto.setMessage((String) map.get("message"));
        dto.setResultCode(String.valueOf(map.get("resultCode")));
        return dto;
    }
}
