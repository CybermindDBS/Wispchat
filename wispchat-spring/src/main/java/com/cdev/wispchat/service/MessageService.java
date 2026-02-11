package com.cdev.wispchat.service;

import com.cdev.wispchat.model.dto.EventDTO;
import com.cdev.wispchat.model.entity.Message;
import com.cdev.wispchat.model.entity.User;
import com.cdev.wispchat.model.mapper.MessageMapper;
import com.cdev.wispchat.repository.MessageRepository;
import com.cdev.wispchat.security.CurrentUserProvider;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Transactional
public class MessageService {
    MessageRepository msgRepository;
    ChatroomService chatroomService;
    UserService userService;
    CurrentUserProvider currentUserProvider;
    MessageMapper messageMapper;

    public MessageService(MessageRepository msgRepository, ChatroomService chatroomService, UserService userService, CurrentUserProvider currentUserProvider, MessageMapper messageMapper) {
        this.msgRepository = msgRepository;
        this.chatroomService = chatroomService;
        this.currentUserProvider = currentUserProvider;
        this.userService = userService;
        this.messageMapper = messageMapper;
    }

    public Message get(String messageId) {
        return msgRepository.findById(messageId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Message not found"));
    }

    public Message save(Message message) {
        return msgRepository.save(message);
    }

    public void delete(String messageId) {
        Message message = get(messageId);
        message.setDeleted(true);
        message.setContent("");
        save(message);
    }

    public List<EventDTO> getAllByChatroomId(String chatroomId) {
        User authenticatedUser = currentUserProvider.getAuthenticatedUser();
        chatroomService.assertMember(chatroomId, authenticatedUser.getUserId());

        List<Message> messages = msgRepository.getAllByChatroomId(chatroomId);

        Set<String> memberIds = messages.stream().map(Message::getSenderId).collect(Collectors.toSet());
        Map<String, User> userDetailsMap = userService.getUserDetails(memberIds);

        List<EventDTO> messageDTOS = messages.stream().map(messageMapper::toDto).toList();
        messageDTOS.forEach(messageDTO -> messageDTO.setSenderName(userDetailsMap.get(messageDTO.getSenderId()).getName()));

        return messageDTOS;
    }

    public void deleteAllByChatroomId(String chatroomId) {
        User authenticatedUser = currentUserProvider.getAuthenticatedUser();
        chatroomService.assertOwner(chatroomId, authenticatedUser.getUserId());
        msgRepository.deleteAllByChatroomId(chatroomId);
    }

    public void assertOwner(String messageId, String userId) {
        Message message = get(messageId);
        if (!message.getSenderId().equals(userId))
            throw new AccessDeniedException("User is not the owner of this message");
    }
}
