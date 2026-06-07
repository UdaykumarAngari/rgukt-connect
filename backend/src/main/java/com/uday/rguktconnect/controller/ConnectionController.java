package com.uday.rguktconnect.controller;

import com.uday.rguktconnect.entity.Connection;
import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.service.connection.impl.ConnectionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "*")
public class ConnectionController {

    @Autowired
    private ConnectionServiceImpl connectionService;

    private String getAuthenticatedEmail() {
        return (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<?> sendRequest(@PathVariable Long receiverId) {
        connectionService.sendConnectionRequest(getAuthenticatedEmail(), receiverId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Connection request transmitted successfully!"));
    }

    @PutMapping("/accept/{requestId}")
    public ResponseEntity<?> acceptRequest(@PathVariable Long requestId) {
        connectionService.acceptConnectionRequest(getAuthenticatedEmail(), requestId);
        return ResponseEntity.ok(Map.of("message", "Connection request approved successfully!"));
    }

    @DeleteMapping("/reject/{requestId}")
    public ResponseEntity<?> rejectOrCancel(@PathVariable Long requestId) {
        connectionService.rejectOrCancelConnection(getAuthenticatedEmail(), requestId);
        return ResponseEntity.ok(Map.of("message", "Connection link removed successfully"));
    }



    @GetMapping("/status/{targetUserId}")
    public ResponseEntity<?> getStatus(@PathVariable Long targetUserId) {
        return ResponseEntity.ok(connectionService.getConnectionStatusWithUser(getAuthenticatedEmail(), targetUserId));
    }

    @GetMapping("/pending-received")
    public ResponseEntity<List<Connection>> getPendingReceived() {
        return ResponseEntity.ok(connectionService.getPendingReceivedRequests(getAuthenticatedEmail()));
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<List<User>> getConnectionList(@PathVariable Long userId) {
        return ResponseEntity.ok(connectionService.getUserConnectionList(userId));
    }
}