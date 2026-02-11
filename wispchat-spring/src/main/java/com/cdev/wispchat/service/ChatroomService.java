package com.cdev.wispchat.service;

import com.cdev.wispchat.model.dto.ChatroomDTO;
import com.cdev.wispchat.model.dto.EventDTO;
import com.cdev.wispchat.model.dto.MemberDTO;
import com.cdev.wispchat.model.entity.Chatroom;
import com.cdev.wispchat.model.entity.Member;
import com.cdev.wispchat.model.entity.User;
import com.cdev.wispchat.model.entity.enums.ContentType;
import com.cdev.wispchat.model.mapper.ChatroomMapper;
import com.cdev.wispchat.model.mapper.MemberMapper;
import com.cdev.wispchat.model.mapper.MessageMapper;
import com.cdev.wispchat.repository.ChatroomRepository;
import com.cdev.wispchat.security.CurrentUserProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Transactional
public class ChatroomService {

    ChatroomRepository chatroomRepository;
    UserService userService;
    CurrentUserProvider currentUserProvider;
    MessageMapper messageMapper;
    ChatroomMapper chatroomMapper;
    MemberMapper memberMapper;


    ChatroomService(ChatroomRepository chatroomRepository, UserService userService, CurrentUserProvider currentUserProvider, MessageMapper messageMapper, MemberMapper memberMapper, ChatroomMapper chatroomMapper) {
        this.chatroomRepository = chatroomRepository;
        this.currentUserProvider = currentUserProvider;
        this.messageMapper = messageMapper;
        this.chatroomMapper = chatroomMapper;
        this.memberMapper = memberMapper;
        this.userService = userService;
    }


    public Chatroom create(String chatroomName) {
        User authenticatedUser = currentUserProvider.getAuthenticatedUser();
        if (chatroomRepository.existsByNameAndMembersMemberIdAndMembersAdmin(chatroomName, authenticatedUser.getUserId(), true))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Chatroom with the given name already exists");
        Chatroom chatroom = new Chatroom();
        chatroom.setName(chatroomName);
        chatroom.setOwnerId(authenticatedUser.getUserId());
        chatroom.getMembers().add(new Member(authenticatedUser.getUserId(), true));
        return chatroomRepository.save(chatroom);
    }

    public void delete(String chatroomId) throws AccessDeniedException {
        Chatroom chatroom = chatroomRepository.findById(chatroomId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Chatroom not found"));
        boolean isAdmin = chatroom.getMembers().stream().anyMatch(member -> member.isAdmin() && currentUserProvider.isCurrentUser(member.getMemberId()));
        if (!isAdmin) throw new AccessDeniedException("Only the room admins can delete the respective room");
        chatroomRepository.deleteById(chatroomId);
    }

    public EventDTO join(String chatroomId) {
        User authenticatedUser = currentUserProvider.getAuthenticatedUser();
        Chatroom chatroom = chatroomRepository.findById(chatroomId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Chatroom not found"));
        EventDTO eventDTO = new EventDTO();
        if (chatroom.getMembers().stream().noneMatch(member -> member.getMemberId().equals(authenticatedUser.getUserId()))) {
            chatroom.getMembers().add(new Member(authenticatedUser.getUserId(), false));
            chatroomRepository.save(chatroom);
            eventDTO.setChatroomId(chatroomId);
            eventDTO.setTimestamp(Instant.now());
            eventDTO.setSenderId(authenticatedUser.getUserId());
            eventDTO.setContentType(ContentType.EVENT_MEMBER_JOIN);
        } else throw new ResponseStatusException(HttpStatus.CONFLICT, "User already a member");
        return eventDTO;
    }

    public EventDTO leave(String chatroomId) {
        try {
            Chatroom chatroom = chatroomRepository.findById(chatroomId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Chatroom not found"));
            boolean removed = chatroom.getMembers().removeIf(member -> !member.isAdmin() && currentUserProvider.isCurrentUser(member.getMemberId()));
            if (!removed)
                throw new ResponseStatusException(HttpStatus.CONFLICT, "The user is not a member of the chatroom or is the owner");
            chatroomRepository.save(chatroom);
            EventDTO eventDTO = new EventDTO();
            eventDTO.setChatroomId(chatroomId);
            eventDTO.setTimestamp(Instant.now());
            eventDTO.setSenderId(currentUserProvider.getAuthenticatedUser().getUserId());
            eventDTO.setContentType(ContentType.EVENT_MEMBER_LEAVE);
            return eventDTO;
        } catch (Exception e) {
            e.printStackTrace();
            return new EventDTO();
        }
    }

    public List<MemberDTO> members(String id) {
        Chatroom chatroom = chatroomRepository.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Chatroom not found"));
        boolean isMember = chatroom.getMembers().stream().anyMatch(member -> currentUserProvider.isCurrentUser(member.getMemberId()));
        if (!isMember) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a member of this chatroom");

        List<Member> members = chatroom.getMembers();
        Set<String> memberIds = members.stream().map(Member::getMemberId).collect(Collectors.toSet());

        return members.stream().map(member -> {
            MemberDTO memberDTO = memberMapper.toDto(member);
            memberDTO.setMemberName(userService.getUserDetails(memberIds).get(member.getMemberId()).getName());
            return memberDTO;
        }).toList();
    }

    public List<ChatroomDTO> list() {
        User authenticatedUser = currentUserProvider.getAuthenticatedUser();

        List<Chatroom> chatrooms = chatroomRepository.findChatroomsByMembersMemberId(authenticatedUser.getUserId());
        List<ChatroomDTO> chatroomDTOS = chatrooms.stream().map(chatroomMapper::toDto).toList();
        Set<String> memberIds = chatroomDTOS.stream().map(ChatroomDTO::getMembers).flatMap(memberDTOS -> memberDTOS.stream().map(MemberDTO::getMemberId)).collect(Collectors.toSet());
        Map<String, User> memberDetailsMap = userService.getUserDetails(memberIds);

        chatroomDTOS.forEach(chatroomDTO -> {
            chatroomDTO.getMembers().forEach((memberDTO -> memberDTO.setMemberName(memberDetailsMap.get(memberDTO.getMemberId()).getName())));
            chatroomDTO.setOwnerName(memberDetailsMap.get(chatroomDTO.getOwnerId()).getName());
        });

        return chatroomDTOS;
    }

    public ChatroomDTO get(String chatroomId) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Chatroom not found"));
        ChatroomDTO chatroomDTO = chatroomMapper.toDto(chatroom);
        Set<String> memberIds = chatroomDTO.getMembers().stream().map(MemberDTO::getMemberId).collect(Collectors.toSet());
        Map<String, User> memberDetailsMap = userService.getUserDetails(memberIds);
        chatroomDTO.getMembers().forEach(memberDTO -> memberDTO.setMemberName(memberDetailsMap.get(memberDTO.getMemberId()).getName()));
        chatroomDTO.setOwnerName(memberDetailsMap.get(chatroomDTO.getOwnerId()).getName());
        return chatroomDTO;
    }

    public void assertMember(String chatroomId) {
        User authenticatedUser = currentUserProvider.getAuthenticatedUser();
        if (!chatroomRepository.existsByChatroomIdAndMembersMemberId(chatroomId, authenticatedUser.getUserId()))
            throw new AccessDeniedException("Not a member of this chatroom");
    }

    public void assertMember(String chatroomId, String userId) {
        if (!chatroomRepository.existsByChatroomIdAndMembersMemberId(chatroomId, userId))
            throw new AccessDeniedException("Not a member of this chatroom");
    }

    public void assertOwner(String chatroomId, String userId) {
        if (!chatroomRepository.existsByChatroomIdAndOwnerId(chatroomId, userId)) {
            System.out.println(chatroomId + " : " + userId);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not an owner of this chatroom");
        }
    }
}
