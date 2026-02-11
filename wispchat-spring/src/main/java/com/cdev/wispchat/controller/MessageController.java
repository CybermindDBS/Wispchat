package com.cdev.wispchat.controller;

import com.cdev.wispchat.model.dto.EventDTO;
import com.cdev.wispchat.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/getAll/{chatroomId}")
    public ResponseEntity<List<EventDTO>> getAllMessagesByChatroom(@PathVariable String chatroomId) {
        return ResponseEntity.ok().body(messageService.getAllByChatroomId(chatroomId));
    }
}
