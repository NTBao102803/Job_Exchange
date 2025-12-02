package iuh.fit.se.message_service.repository;

import iuh.fit.se.message_service.entity.UnreadCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UnreadCountRepository extends JpaRepository<UnreadCount, Long> {
    Optional<UnreadCount> findByConversationIdAndUserIdAndUserType(Long convId, Long userId, String userType);

    @Modifying
    @Query("UPDATE UnreadCount SET count = 0 WHERE conversationId = :convId AND userId = :userId AND userType = :userType")
    void resetCount(@Param("convId") Long convId, @Param("userId") Long userId, @Param("userType") String userType);

    @Query("SELECT COALESCE(SUM(uc.count), 0) FROM UnreadCount uc WHERE uc.userId = :userId AND uc.userType = :userType")
    int sumCountByUser(@Param("userId") Long userId, @Param("userType") String userType);
}
