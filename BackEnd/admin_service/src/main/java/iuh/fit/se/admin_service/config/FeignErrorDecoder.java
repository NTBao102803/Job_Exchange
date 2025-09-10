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
        log.error("❌ Feign error [{}]: status={} reason={}", methodKey, response.status(), response.reason());
        if (response.status() == 403) {
            return new RuntimeException("Forbidden: bạn không có quyền gọi API job-service");
        }
        return new ErrorDecoder.Default().decode(methodKey, response);
    }
}
