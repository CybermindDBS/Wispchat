package com.cdev.wispchat.controller;

import com.cdev.wispchat.model.dto.EventDTO;
import com.cdev.wispchat.security.CurrentUserProvider;
import com.cdev.wispchat.service.ChatEventService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatEventController {
    ChatEventService eventService;
    CurrentUserProvider currentUserProvider;

    public ChatEventController(ChatEventService messageService, CurrentUserProvider currentUserProvider) {
        this.eventService = messageService;
        this.currentUserProvider = currentUserProvider;
    }

    @MessageMapping("send")
    public void sendMessage(EventDTO eventDTO, Principal principal) {
        eventService.sendMessage(eventDTO, currentUserProvider.getAuthenticatedUser(principal));
    }

    @MessageMapping("delete")
    public void deleteMessage(EventDTO eventDTO, Principal principal) {
        eventService.deleteMessage(eventDTO, currentUserProvider.getAuthenticatedUser(principal));
    }

    @MessageMapping("type")
    public void typingMessage(EventDTO eventDTO, Principal principal) {
        eventService.typeEvent(eventDTO, currentUserProvider.getAuthenticatedUser(principal));
    }
}
