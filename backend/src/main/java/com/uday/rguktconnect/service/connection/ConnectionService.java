package com.uday.rguktconnect.service.connection;

import com.uday.rguktconnect.entity.Connection;
import com.uday.rguktconnect.entity.User;
import java.util.List;
import java.util.Map;

public interface ConnectionService {
    void sendConnectionRequest(String currentEmail, Long receiverId);
    void acceptConnectionRequest(String currentEmail, Long requestId);
    void rejectOrCancelConnection(String currentEmail, Long requestId);
    Map<String, Object> getConnectionStatusWithUser(String currentEmail, Long targetUserId);
    List<Connection> getPendingReceivedRequests(String currentEmail);
    List<Map<String, Object>> getUserConnectionList(Long userId);
    boolean areConnected(Long userAId, Long userBId);
}