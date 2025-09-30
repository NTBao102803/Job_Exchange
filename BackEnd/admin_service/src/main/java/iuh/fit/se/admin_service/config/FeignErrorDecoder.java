package iuh.fit.se.admin_service.config;

import feign.Response;
import feign.codec.ErrorDecoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class FeignErrorDecoder implements ErrorDecoder {
    private final Logger log = LoggerFactory.getLogger(FeignErrorDecoder.class);

    @Override
    public Exception decode(String methodKey, Response response) {
        String url = response.request() != null ? response.request().url() : "unknown-url";

        // methodKey có dạng: EmployerClient#approveEmployer(Long)
        // => ta lấy tên class feignClient = EmployerClient
        String clientName = methodKey.contains("#") ? methodKey.split("#")[0] : "unknown-client";

        log.error("❌ Feign error [{}]: status={} reason={} url={}",
                methodKey, response.status(), response.reason(), url);

        if (response.status() == 403) {
            return new RuntimeException("Forbidden: bạn không có quyền gọi API từ " + clientName);
        } else if (response.status() == 404) {
            return new RuntimeException("Not Found: API từ " + clientName + " không tồn tại");
        } else if (response.status() == 503) {
            return new RuntimeException("Service Unavailable: " + clientName + " không khả dụng");
        }

        return new ErrorDecoder.Default().decode(methodKey, response);
    }
}
