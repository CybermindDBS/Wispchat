package com.cdev.wispchat.repository;

import com.cdev.wispchat.model.entity.Chatroom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatroomRepository extends MongoRepository<Chatroom, String> {

    @Query("""
            {
            "ownerId": ?0,
              "members": {
                "$elemMatch": {
                  "memberId": ?0,
                  "admin": true
                }
              }
            }
            """)
    List<Chatroom> findChatroomsByOwner(String memberId);

    List<Chatroom> findChatroomsByMembersMemberId(String memberId);

    boolean existsByChatroomIdAndOwnerId(String chatroomId, String ownerId);

    boolean existsByChatroomIdAndMembersMemberId(String chatroomId, String memberId);

    boolean existsByNameAndMembersMemberIdAndMembersAdmin(String name, String memberId, Boolean admin);
}
