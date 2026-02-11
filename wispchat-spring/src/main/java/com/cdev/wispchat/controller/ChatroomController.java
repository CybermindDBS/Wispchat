package com.cdev.wispchat.controller;

import com.cdev.wispchat.model.dto.ChatroomDTO;
import com.cdev.wispchat.model.dto.EventDTO;
import com.cdev.wispchat.model.dto.MemberDTO;
import com.cdev.wispchat.model.entity.Chatroom;
import com.cdev.wispchat.service.ChatEventService;
import com.cdev.wispchat.service.ChatroomService;
import com.cdev.wispchat.service.MessageService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chatroom")
@Validated
public class ChatroomController {

    ChatroomService chatroomService;
    ChatEventService chatEventService;
    MessageService messageService;

    ChatroomController(ChatroomService chatroomService, ChatEventService chatEventService, MessageService messageService) {
        this.chatroomService = chatroomService;
        this.chatEventService = chatEventService;
        this.messageService = messageService;
    }

    @PostMapping("/create")
    public ResponseEntity<Chatroom> create(
            @RequestParam
            @NotBlank(message = "Value is required")
            String name) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatroomService.create(name));
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        messageService.deleteAllByChatroomId(id);
        chatroomService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Void> join(@PathVariable String id) {
        EventDTO eventDTO = chatroomService.join(id);
        chatEventService.memberEvent(eventDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<?> leave(@PathVariable String id) {
        EventDTO eventDTO = chatroomService.leave(id);
        chatEventService.memberEvent(eventDTO);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<MemberDTO>> members(@PathVariable String id) {
        List<MemberDTO> members = chatroomService.members(id);
        return ResponseEntity.ok().body(members);
    }

    @GetMapping("/list")
    public ResponseEntity<List<ChatroomDTO>> list() {
        return ResponseEntity.ok().body(chatroomService.list());
    }

    @GetMapping("/{id}/get")
    public ResponseEntity<ChatroomDTO> get(@PathVariable String id) {
        return ResponseEntity.ok().body(chatroomService.get(id));
    }

    @GetMapping("/{id}/isMember")
    public ResponseEntity<?> isMember(@PathVariable String id) {
        chatroomService.assertMember(id);
        return ResponseEntity.ok().build();
    }
}
