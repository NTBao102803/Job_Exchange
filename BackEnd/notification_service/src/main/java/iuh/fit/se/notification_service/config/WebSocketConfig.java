package iuh.fit.se.notification_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final AuthHandshakeInterceptor authHandshakeInterceptor;

    public WebSocketConfig(AuthHandshakeInterceptor authHandshakeInterceptor) {
        this.authHandshakeInterceptor = authHandshakeInterceptor;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-notifications")
                .addInterceptors(authHandshakeInterceptor)
                .setAllowedOriginPatterns(
                        "http://localhost:5173",
                        "https://www.jobsv.online",
                        "https://jobsv.online")
                .withSockJS();
    }
}
