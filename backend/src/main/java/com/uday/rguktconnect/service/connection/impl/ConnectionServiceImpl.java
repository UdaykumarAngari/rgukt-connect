package com.uday.rguktconnect.service.connection.impl;

import com.uday.rguktconnect.entity.Connection;
import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.repository.connection.ConnectionRepository;
import com.uday.rguktconnect.repository.user.UserRepository;
import com.uday.rguktconnect.service.connection.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uday.rguktconnect.service.notification.NotificationService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class ConnectionServiceImpl implements ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public void sendConnectionRequest(String currentEmail, Long receiverId) {
        User sender = userRepository.findByUniversityEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Sender profile context missing"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Target profile record not found"));

        if (sender.getId().equals(receiverId)) {
            throw new RuntimeException("You cannot connect with yourself");
        }

        Optional<Connection> existingConnection = connectionRepository.findConnectionBetweenUsers(sender, receiver);
        if (existingConnection.isPresent()) {
            throw new RuntimeException("A connection relationship lifecycle is already active");
        }

        Connection newInvite = new Connection();
        newInvite.setSender(sender);
        newInvite.setReceiver(receiver);
        newInvite.setStatus("PENDING");

        Connection savedInvite = connectionRepository.save(newInvite);
        notificationService.createNotification(sender, receiver, "CONNECTION_REQUEST", savedInvite.getId());
    }

    @Override
    public void acceptConnectionRequest(String currentEmail, Long requestId) {
        Connection invite = connectionRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Connection record missing"));

        User currentUser = userRepository.findByUniversityEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Identity context missing"));

        if (!invite.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the receiver can accept this invitation");
        }

        invite.setStatus("ACCEPTED");
        Connection savedInvite = connectionRepository.save(invite);
        notificationService.createNotification(currentUser, invite.getSender(), "CONNECTION_ACCEPTED", savedInvite.getId());
    }

    @Override
    public void rejectOrCancelConnection(String currentEmail, Long requestId) {
        Connection invite = connectionRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Connection record missing"));

        User currentUser = userRepository.findByUniversityEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Identity context missing"));

        if (!invite.getReceiver().getId().equals(currentUser.getId()) &&
                !invite.getSender().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized interaction attempt");
        }

        connectionRepository.delete(invite);
    }

    @Override
    public Map<String, Object> getConnectionStatusWithUser(String currentEmail, Long targetUserId) {
        User currentUser = userRepository.findByUniversityEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Identity context missing"));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        Optional<Connection> connectionOpt = connectionRepository.findConnectionBetweenUsers(currentUser, targetUser);

        if (connectionOpt.isEmpty()) {
            return Map.of("status", "NOT_CONNECTED");
        }

        Connection connection = connectionOpt.get();

        if (connection.getStatus().equalsIgnoreCase("ACCEPTED")) {
            return Map.of("status", "ACCEPTED", "connectionId", connection.getId());
        }

        if (connection.getSender().getId().equals(currentUser.getId())) {
            return Map.of("status", "PENDING_SENT", "connectionId", connection.getId());
        } else {
            return Map.of("status", "PENDING_RECEIVED", "connectionId", connection.getId());
        }
    }

    @Override
    public List<Connection> getPendingReceivedRequests(String currentEmail) {
        User currentUser = userRepository.findByUniversityEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Identity context missing"));

        return connectionRepository.findByReceiverAndStatus(currentUser, "PENDING");
    }

    @Autowired
    private com.uday.rguktconnect.repository.user.UserDetailsRepository userDetailsRepository;

    @Override
    public List<Map<String, Object>> getUserConnectionList(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Target profile record not found");
        }
        List<User> connectedUsers = connectionRepository.findConnectedUsers(userId);
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (User u : connectedUsers) {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", u.getId());
            map.put("idNumber", u.getIdNumber());
            map.put("name", u.getName());
            map.put("universityEmail", u.getUniversityEmail());
            
            String photo = userDetailsRepository.findByUser(u)
                    .map(com.uday.rguktconnect.entity.UserDetails::getProfilePhoto)
                    .orElse(null);
            map.put("profilePhoto", photo);
            result.add(map);
        }
        return result;
    }

    @Override
    public boolean areConnected(Long userAId, Long userBId) {
        return connectionRepository.areUsersConnected(userAId, userBId);
    }
}