package com.cdev.wispchat.ai.service;

import com.cdev.wispchat.model.dto.EventDTO;
import com.cdev.wispchat.model.entity.Message;
import com.cdev.wispchat.model.entity.enums.ContentType;
import com.cdev.wispchat.model.mapper.MessageMapper;
import com.cdev.wispchat.service.MessageService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AIResponseService {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final MessageMapper messageMapper;

    public AIResponseService(SimpMessagingTemplate messagingTemplate, MessageService messageService, MessageMapper messageMapper) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
        this.messageMapper = messageMapper;
    }

    public void sendMessage(EventDTO responseDTO) {
        responseDTO.setTimestamp(Instant.now());
        responseDTO.setDeleted(false);
        responseDTO.setContentType(ContentType.TEXT);
        responseDTO.setContent(responseDTO.getContent());
        responseDTO.setSenderId("wispchat_ai");
        responseDTO.setSenderName("WispChat AI");
        Message message = messageService.save(messageMapper.toEntity(responseDTO));
        responseDTO.setId(message.getMessageId());
        messagingTemplate.convertAndSend("/topic/chatroom/" + responseDTO.getChatroomId(), responseDTO);
    }
}
