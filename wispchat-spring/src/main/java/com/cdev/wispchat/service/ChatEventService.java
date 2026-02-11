package com.cdev.wispchat.service;

import com.cdev.wispchat.model.dto.EventDTO;
import com.cdev.wispchat.model.entity.Message;
import com.cdev.wispchat.model.entity.User;
import com.cdev.wispchat.model.entity.enums.ContentType;
import com.cdev.wispchat.model.entity.enums.Status;
import com.cdev.wispchat.model.mapper.MessageMapper;
import com.cdev.wispchat.security.CurrentUserProvider;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ChatEventService {
    ChatroomService chatroomService;
    MessageService messageService;
    UserService userService;
    SimpMessagingTemplate messagingTemplate;
    MessageMapper messageMapper;
    CurrentUserProvider currentUserProvider;

    public ChatEventService(MessageService messageService, ChatroomService chatroomService, UserService userService, MessageMapper messageMapper, CurrentUserProvider currentUserProvider, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.chatroomService = chatroomService;
        this.userService = userService;
        this.messageMapper = messageMapper;
        this.messagingTemplate = messagingTemplate;
        this.currentUserProvider = currentUserProvider;
    }

    public void sendMessage(EventDTO eventDTO, User user) {
        chatroomService.assertMember(eventDTO.getChatroomId(), user.getUserId());
        eventDTO.setSenderId(user.getUserId());
        eventDTO.setSenderName(user.getName());
        eventDTO.setTimestamp(Instant.now());
        eventDTO.setDeleted(false);
        eventDTO.setContentType(ContentType.TEXT);
        Message message = messageService.save(messageMapper.toEntity(eventDTO));
        eventDTO.setId(message.getMessageId());
        messagingTemplate.convertAndSend("/topic/chatroom/" + eventDTO.getChatroomId(), eventDTO);
    }

    public void deleteMessage(EventDTO eventDTO, User user) {
        messageService.assertOwner(eventDTO.getId(), user.getUserId());
        messageService.delete(eventDTO.getId());
        eventDTO.setContentType(ContentType.EVENT_DELETE_RECEIPT);
        eventDTO.setStatus(Status.COMPLETE);
        messagingTemplate.convertAndSend("/topic/chatroom/" + eventDTO.getChatroomId(), eventDTO);
    }

    public void typeEvent(EventDTO eventDTO, User user) {
        chatroomService.assertMember(eventDTO.getChatroomId(), user.getUserId());
        eventDTO.setContentType(ContentType.EVENT_TYPING);
        eventDTO.setSenderId(user.getUserId());
        messagingTemplate.convertAndSend("/topic/chatroom/" + eventDTO.getChatroomId(), eventDTO);
    }

    public void fileUpload(EventDTO eventDTO) {
        messagingTemplate.convertAndSend("/topic/chatroom/" + eventDTO.getChatroomId(), eventDTO);
    }

    public void memberEvent(EventDTO eventDTO) {
        Message message = messageService.save(messageMapper.toEntity(eventDTO));
        eventDTO.setId(message.getMessageId());
        eventDTO.setSenderName(currentUserProvider.getAuthenticatedUser().getName());
        messagingTemplate.convertAndSend("/topic/chatroom/" + eventDTO.getChatroomId(), eventDTO);
    }
}
