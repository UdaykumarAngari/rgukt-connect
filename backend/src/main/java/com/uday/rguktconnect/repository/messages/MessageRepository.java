package com.uday.rguktconnect.repository.messages;

import com.uday.rguktconnect.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.sender.id = :userA AND m.receiver.id = :userB) OR " +
            "(m.sender.id = :userB AND m.receiver.id = :userA) " +
            "ORDER BY m.timestamp ASC")
    List<ChatMessage> findChatHistory(@Param("userA") Long userA, @Param("userB") Long userB);
 
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.receiver.id = :userId AND m.isRead = false")
    long countUnreadMessages(@Param("userId") Long userId);

    @Query("SELECT m.sender.id, COUNT(m) FROM ChatMessage m WHERE m.receiver.id = :userId AND m.isRead = false GROUP BY m.sender.id")
    List<Object[]> countUnreadGroupBySender(@Param("userId") Long userId);
 
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.sender.id = :senderId AND m.receiver.id = :receiverId AND m.isRead = false")
    void markThreadAsRead(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
}