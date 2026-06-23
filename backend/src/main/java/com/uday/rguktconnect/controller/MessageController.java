package com.uday.rguktconnect.controller;

import com.uday.rguktconnect.entity.ChatMessage;
import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.repository.connection.ConnectionRepository;
import com.uday.rguktconnect.repository.messages.MessageRepository;
import com.uday.rguktconnect.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class MessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository chatMessageRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    private String getAuthenticatedEmail() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/api/chat/history/{targetUserId}")
    public ResponseEntity<?> getChatHistory(@PathVariable Long targetUserId) {
        User currentUser = userRepository.findByUniversityEmail(getAuthenticatedEmail())
                .orElseThrow(() -> new RuntimeException("Identity context missing"));

        boolean isConnected = connectionRepository.areUsersConnected(currentUser.getId(), targetUserId);
        if (!isConnected) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only message connected members"));
        }

        List<ChatMessage> history = chatMessageRepository.findChatHistory(currentUser.getId(), targetUserId);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/api/chat/send")
    public ResponseEntity<?> sendHttpMessage(@RequestBody Map<String, Object> payload) {
        try {
            User sender = userRepository.findByUniversityEmail(getAuthenticatedEmail())
                    .orElseThrow(() -> new RuntimeException("Identity context missing"));
            Long receiverId = Long.valueOf(payload.get("receiverId").toString());
            String content = payload.get("content").toString();

            if (!connectionRepository.areUsersConnected(sender.getId(), receiverId)) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only message connected members"));
            }

            User receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

            ChatMessage msg = new ChatMessage();
            msg.setSender(sender);
            msg.setReceiver(receiver);
            msg.setContent(content);
            ChatMessage savedMsg = chatMessageRepository.save(msg);

            messagingTemplate.convertAndSendToUser(
                    receiverId.toString(),
                    "/queue/messages",
                    savedMsg
            );

            return ResponseEntity.ok(savedMsg);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }


    @MessageMapping("/chat.sendMessage")
    public void processMessage(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String content = payload.get("content").toString();

        if (!connectionRepository.areUsersConnected(senderId, receiverId)) {
            return; // Drop packet silently if connection is missing or severed
        }

        User sender = userRepository.findById(senderId).orElse(null);
        User receiver = userRepository.findById(receiverId).orElse(null);

        if (sender != null && receiver != null) {
            ChatMessage msg = new ChatMessage();
            msg.setSender(sender);
            msg.setReceiver(receiver);
            msg.setContent(content);
            ChatMessage savedMsg = chatMessageRepository.save(msg);

            messagingTemplate.convertAndSendToUser(
                    receiverId.toString(),
                    "/queue/messages",
                    savedMsg
            );
        }
    }
}