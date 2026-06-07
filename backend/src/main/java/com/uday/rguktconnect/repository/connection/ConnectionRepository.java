package com.uday.rguktconnect.repository.connection;

import com.uday.rguktconnect.entity.Connection;
import com.uday.rguktconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {


    Optional<Connection> findBySenderAndReceiver(User sender, User receiver);


    List<Connection> findByReceiverAndStatus(User receiver, String status);

    @Query("SELECT c FROM Connection c WHERE " +
            "(c.sender = :userA AND c.receiver = :userB) OR " +
            "(c.sender = :userB AND c.receiver = :userA)")
    Optional<Connection> findConnectionBetweenUsers(@Param("userA") User userA, @Param("userB") User userB);

    @Query("SELECT c.receiver.id FROM Connection c WHERE c.sender.id = :userId AND c.status = 'ACCEPTED' " +
            "UNION " +
            "SELECT c.sender.id FROM Connection c WHERE c.receiver.id = :userId AND c.status = 'ACCEPTED'")
    List<Long> findConnectedUserIds(@Param("userId") Long userId);

    @Query("SELECT c.receiver FROM Connection c WHERE c.sender.id = :userId AND c.status = 'ACCEPTED' " +
            "UNION " +
            "SELECT c.sender FROM Connection c WHERE c.receiver.id = :userId AND c.status = 'ACCEPTED'")
    List<User> findConnectedUsers(@Param("userId") Long userId);

    @Query("SELECT COUNT(c) > 0 FROM Connection c WHERE c.status = 'ACCEPTED' AND (" +
            "(c.sender.id = :userAId AND c.receiver.id = :userBId) OR " +
            "(c.sender.id = :userBId AND c.receiver.id = :userAId))")
    boolean areUsersConnected(@Param("userAId") Long userAId, @Param("userBId") Long userBId);
}