package com.cdev.wispchat.repository;

import com.cdev.wispchat.model.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    void deleteAllByChatroomId(String chatroomId);

    List<Message> getAllByChatroomId(String chatroomId);
}
